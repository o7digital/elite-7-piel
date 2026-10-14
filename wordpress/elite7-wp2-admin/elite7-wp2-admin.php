<?php
/**
 * Plugin Name: Elite 7 WP2 Admin
 * Description: Campos internos de Especiales y base privada de clientes para Elite 7 Piel.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */
if (!defined('ABSPATH')) { exit; }

final class Elite7_WP2_Admin {
    const PRODUCT_META = '_elite7_admin_specials_v1';
    const CLIENT_META = '_elite7_client_profile_v1';
    const CLIENT_TYPE = 'elite7_client';

    public static function boot() {
        add_action('admin_enqueue_scripts', array(__CLASS__, 'product_scripts'));
        add_action('init', array(__CLASS__, 'register_clients'));
        add_filter('woocommerce_product_data_tabs', array(__CLASS__, 'product_tab'));
        add_action('woocommerce_product_data_panels', array(__CLASS__, 'product_panel'));
        add_action('woocommerce_admin_process_product_object', array(__CLASS__, 'save_product'));
        add_action('add_meta_boxes', array(__CLASS__, 'client_meta_box'));
        add_action('save_post_' . self::CLIENT_TYPE, array(__CLASS__, 'save_client_form'), 10, 2);
        add_filter('wp_insert_post_data', array(__CLASS__, 'private_client_post'), 10, 2);
        add_action('rest_api_init', array(__CLASS__, 'rest_routes'));
        add_filter('manage_' . self::CLIENT_TYPE . '_posts_columns', array(__CLASS__, 'client_columns'));
        add_action('manage_' . self::CLIENT_TYPE . '_posts_custom_column', array(__CLASS__, 'client_column'), 10, 2);
    }
    public static function allowed() {
        return current_user_can('manage_woocommerce') || current_user_can('manage_options');
    }
    public static function register_clients() {
        $caps = array();
        foreach (array('edit_post', 'read_post', 'delete_post', 'edit_posts', 'edit_others_posts', 'publish_posts', 'read_private_posts', 'delete_posts', 'delete_private_posts', 'delete_published_posts', 'delete_others_posts', 'edit_private_posts', 'edit_published_posts', 'create_posts') as $cap) { $caps[$cap] = 'manage_woocommerce'; }
        register_post_type(self::CLIENT_TYPE, array(
            'labels' => array('name' => 'Clientes Especiales', 'singular_name' => 'Cliente', 'add_new_item' => 'Añadir cliente', 'edit_item' => 'Editar cliente'),
            'public' => false, 'publicly_queryable' => false, 'exclude_from_search' => true,
            'show_ui' => true, 'show_in_rest' => false, 'show_in_menu' => 'woocommerce',
            'supports' => array('title'), 'capabilities' => $caps, 'map_meta_cap' => false,
            'menu_icon' => 'dashicons-groups',
        ));
    }
    public static function private_client_post($data, $postarr) {
        if ($data['post_type'] === self::CLIENT_TYPE && !in_array($data['post_status'], array('trash', 'auto-draft'), true)) { $data['post_status'] = 'private'; }
        return $data;
    }
    public static function timestamp() { return (new DateTimeImmutable('now', new DateTimeZone('UTC')))->format('Y-m-d\TH:i:s.v\Z'); }
    public static function product_fields() {
        return array(
            'manufacturer' => array('Fabricante', 'text'), 'distributor' => array('Distribuidor', 'text'),
            'purchasePrice' => array('Precio de compra (MXN)', 'number'), 'targetMargin' => array('Margen objetivo (%)', 'number'),
            'salePrice' => array('Precio de venta propuesto (MXN)', 'number'), 'shippingCost' => array('Costo de envío (MXN)', 'number'),
            'shippingCharge' => array('Envío cobrado al cliente (MXN)', 'number'), 'packagingCost' => array('Empaque (MXN)', 'number'),
            'feePercent' => array('Comisión de pago (%)', 'number'), 'deliveryDays' => array('Entrega estimada (días)', 'number'),
        );
    }
    public static function product_scripts() {
        $screen = get_current_screen();
        if ($screen && $screen->post_type === 'product') { wp_enqueue_script('elite7-product-margin', plugins_url('product-margin.js', __FILE__), array(), '1.0.0', true); }
    }
    public static function product_tab($tabs) {
        $tabs['elite7_specials'] = array('label' => 'Especiales', 'target' => 'elite7_specials_panel', 'priority' => 65);
        return $tabs;
    }
    public static function product_panel() {
        global $product_object;
        if (!$product_object || !self::allowed()) { return; }
        $data = $product_object->get_meta(self::PRODUCT_META, true);
        $data = is_array($data) ? $data : array();
        echo '<div id="elite7_specials_panel" class="panel woocommerce_options_panel hidden"><div class="options_group">';
        echo '<p class="form-field">Datos internos del negocio, compartidos con el dashboard Vercel. La categoría se edita en la sección habitual de categorías de producto.</p>';
        foreach (self::product_fields() as $key => $field) {
            $value = isset($data[$key]) ? $data[$key] : '';
            if ($key === 'distributor' && $value === '' && isset($data['supplier'])) { $value = $data['supplier']; }
            if ($key === 'salePrice' && $value === '') { $value = $product_object->get_price(); }
            woocommerce_wp_text_input(array('id' => 'elite7_' . $key, 'label' => $field[0], 'value' => $value, 'type' => $field[1], 'custom_attributes' => $field[1] === 'number' ? array('min' => '0', 'step' => $key === 'deliveryDays' ? '1' : '0.01') : array('maxlength' => '2000')));
        }
        woocommerce_wp_text_input(array('id' => 'elite7_realMargin', 'label' => 'Margen real (%)', 'value' => '', 'custom_attributes' => array('readonly' => 'readonly')));
        woocommerce_wp_text_input(array('id' => 'elite7_profit', 'label' => 'Utilidad por pedido (MXN)', 'value' => '', 'custom_attributes' => array('readonly' => 'readonly')));
        $carrier = isset($data['carrier']) ? $data['carrier'] : '';
        $options = array('' => 'Por definir', 'Estafeta' => 'Estafeta', 'DHL' => 'DHL', 'FedEx' => 'FedEx', 'UPS' => 'UPS', 'Recogida' => 'Recogida en tienda');
        if ($carrier !== '' && !isset($options[$carrier])) { $options[$carrier] = $carrier; }
        woocommerce_wp_select(array('id' => 'elite7_carrier', 'label' => 'Tipo de envío / transportista', 'value' => $carrier, 'options' => $options));
        woocommerce_wp_select(array('id' => 'elite7_shippingMode', 'label' => 'Cobro del envío', 'value' => isset($data['shippingMode']) ? $data['shippingMode'] : 'included', 'options' => array('included' => 'Incluido en el precio', 'separate' => 'Cobrado por separado')));
        woocommerce_wp_textarea_input(array('id' => 'elite7_notes', 'label' => 'Notas internas', 'value' => isset($data['notes']) ? $data['notes'] : ''));
        wp_nonce_field('elite7_save_product', 'elite7_product_nonce');
        echo '<p class="form-field">El precio propuesto no modifica el precio público. El precio de venta público sigue en WooCommerce → General.</p></div></div>';
    }
    public static function save_product($product) {
        if (!self::allowed() || !isset($_POST['elite7_product_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['elite7_product_nonce'])), 'elite7_save_product')) { return; }
        $data = $product->get_meta(self::PRODUCT_META, true);
        $data = is_array($data) ? $data : array();
        $error = false;
        foreach (self::product_fields() as $key => $field) {
            $raw = isset($_POST['elite7_' . $key]) ? trim(wp_unslash($_POST['elite7_' . $key])) : '';
            if ($field[1] === 'text') { $data[$key] = sanitize_text_field($raw); continue; }
            if ($raw === '') { $data[$key] = $key === 'purchasePrice' || $key === 'deliveryDays' ? null : ($key === 'targetMargin' ? 35 : ($key === 'salePrice' ? (float) $product->get_price() : 0)); continue; }
            $number = str_replace(',', '.', $raw);
            if (!is_numeric($number) || !is_finite((float) $number) || (float) $number < 0 || (in_array($key, array('feePercent', 'targetMargin'), true) && (float) $number >= 100) || ($key === 'deliveryDays' && floor((float) $number) !== (float) $number)) { $error = true; break; }
            $data[$key] = (float) $number;
        }
        if ($error) { WC_Admin_Meta_Boxes::add_error('Los datos de Especiales no se guardaron: revisa precios, margen y días de entrega.'); return; }
        $data['carrier'] = isset($_POST['elite7_carrier']) ? sanitize_text_field(wp_unslash($_POST['elite7_carrier'])) : '';
        $mode = isset($_POST['elite7_shippingMode']) ? sanitize_text_field(wp_unslash($_POST['elite7_shippingMode'])) : 'included';
        if (!in_array($mode, array('included', 'separate'), true)) { return; }
        $data['shippingMode'] = $mode;
        $data['notes'] = isset($_POST['elite7_notes']) ? sanitize_textarea_field(wp_unslash($_POST['elite7_notes'])) : '';
        $data['updatedAt'] = self::timestamp(); $data['version'] = 1;
        $product->update_meta_data(self::PRODUCT_META, $data);
    }
    public static function client_fields() {
        return array('firstName' => 'Nombre', 'lastName' => 'Apellidos', 'email' => 'Correo electrónico', 'phone' => 'Teléfono', 'company' => 'Empresa', 'taxId' => 'RFC', 'address' => 'Dirección', 'city' => 'Ciudad', 'state' => 'Estado', 'postalCode' => 'Código postal', 'country' => 'País', 'notes' => 'Notas internas');
    }
    public static function client_meta_box() { add_meta_box('elite7_client_profile', 'Datos del cliente', array(__CLASS__, 'client_form'), self::CLIENT_TYPE, 'normal', 'high'); }
    public static function client_form($post) {
        if (!self::allowed()) { return; }
        $data = get_post_meta($post->ID, self::CLIENT_META, true); $data = is_array($data) ? $data : array();
        wp_nonce_field('elite7_save_client', 'elite7_client_nonce');
        echo '<p>Ficha interna de cliente. No crea una cuenta de tienda ni envía correos.</p><table class="form-table">';
        foreach (self::client_fields() as $key => $label) {
            $value = isset($data[$key]) ? $data[$key] : ($key === 'country' ? 'MX' : '');
            echo '<tr><th><label for="elite7_client_' . esc_attr($key) . '">' . esc_html($label) . '</label></th><td>';
            if ($key === 'notes') { echo '<textarea class="large-text" rows="4" id="elite7_client_notes" name="elite7_client_notes">' . esc_textarea($value) . '</textarea>'; }
            else { echo '<input class="regular-text" id="elite7_client_' . esc_attr($key) . '" name="elite7_client_' . esc_attr($key) . '" type="' . ($key === 'email' ? 'email' : 'text') . '" maxlength="500" value="' . esc_attr($value) . '">'; }
            echo '</td></tr>';
        }
        echo '</table>';
    }
    public static function validate_client($input, $id = 0) {
        if (!is_array($input)) { return new WP_Error('elite7_invalid_client', 'Datos del cliente no válidos.', array('status' => 400)); }
        $data = array();
        foreach (self::client_fields() as $key => $label) {
            $raw = isset($input[$key]) ? $input[$key] : '';
            if (!is_string($raw) || strlen($raw) > ($key === 'notes' ? 4000 : 500)) { return new WP_Error('elite7_invalid_field', 'Revisa el campo ' . $label . '.', array('status' => 400)); }
            $data[$key] = $key === 'notes' ? sanitize_textarea_field($raw) : sanitize_text_field($raw);
        }
        if (trim($data['firstName'] . $data['lastName'] . $data['company']) === '') { return new WP_Error('elite7_client_name', 'Indica nombre o empresa.', array('status' => 400)); }
        if ($data['email'] !== '' && !is_email($data['email'])) { return new WP_Error('elite7_client_email', 'El correo electrónico no es válido.', array('status' => 400)); }
        $data['email'] = strtolower($data['email']);
        if ($data['email'] !== '') {
            $duplicate = get_posts(array('post_type' => self::CLIENT_TYPE, 'post_status' => 'private', 'posts_per_page' => 1, 'fields' => 'ids', 'post__not_in' => $id ? array($id) : array(), 'meta_key' => '_elite7_client_email', 'meta_value' => $data['email']));
            if ($duplicate) { return new WP_Error('elite7_duplicate_email', 'Ya existe un cliente con este correo.', array('status' => 409)); }
        }
        return $data;
    }
    public static function save_client_form($id, $post) {
        if (!self::allowed() || wp_is_post_revision($id) || (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || !isset($_POST['elite7_client_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['elite7_client_nonce'])), 'elite7_save_client')) { return; }
        $input = array(); foreach (self::client_fields() as $key => $label) { $input[$key] = isset($_POST['elite7_client_' . $key]) ? wp_unslash($_POST['elite7_client_' . $key]) : ''; }
        $data = self::validate_client($input, $id);
        if (is_wp_error($data)) { set_transient('elite7_client_error_' . get_current_user_id(), $data->get_error_message(), 60); return; }
        self::persist_client($id, $data);
    }
    public static function persist_client($id, $data) {
        $data['updatedAt'] = self::timestamp();
        update_post_meta($id, self::CLIENT_META, $data); update_post_meta($id, '_elite7_client_email', $data['email']);
    }
    public static function client_record($id) {
        $data = get_post_meta($id, self::CLIENT_META, true);
        $record = array_merge(array_fill_keys(array_keys(self::client_fields()), ''), is_array($data) ? $data : array(), array('id' => (int) $id));
        if (trim($record['firstName'] . $record['lastName'] . $record['company']) === '') { $record['firstName'] = get_the_title($id); }
        return $record;
    }
    public static function rest_routes() {
        register_rest_route('elite7/v1', '/clients', array(
            array('methods' => 'GET', 'callback' => array(__CLASS__, 'list_clients'), 'permission_callback' => array(__CLASS__, 'allowed')),
            array('methods' => 'POST', 'callback' => array(__CLASS__, 'write_client'), 'permission_callback' => array(__CLASS__, 'allowed')),
        ));
        register_rest_route('elite7/v1', '/clients/(?P<id>\d+)', array('methods' => 'PUT', 'callback' => array(__CLASS__, 'write_client'), 'permission_callback' => array(__CLASS__, 'allowed')));
    }
    public static function list_clients($request) {
        $page = max(1, (int) $request->get_param('page'));
        $query = new WP_Query(array('post_type' => self::CLIENT_TYPE, 'post_status' => 'private', 'posts_per_page' => 100, 'paged' => $page, 'orderby' => 'title', 'order' => 'ASC'));
        $response = new WP_REST_Response(array_map(function ($post) { return self::client_record($post->ID); }, $query->posts));
        $response->header('X-WP-TotalPages', max(1, (int) $query->max_num_pages)); $response->header('Cache-Control', 'private, no-store');
        return $response;
    }
    public static function write_client($request) {
        $id = (int) $request->get_param('id');
        if ($id && (get_post_type($id) !== self::CLIENT_TYPE || get_post_status($id) !== 'private')) { return new WP_Error('elite7_not_found', 'Cliente no encontrado.', array('status' => 404)); }
        $input = $request->get_json_params();
        if ($id) {
            $current = self::client_record($id);
            if (!isset($input['expectedUpdatedAt']) || $input['expectedUpdatedAt'] !== (isset($current['updatedAt']) ? $current['updatedAt'] : '')) { return new WP_Error('elite7_client_conflict', 'Otro usuario modificó el cliente. Actualiza antes de guardar.', array('status' => 409)); }
        }
        $data = self::validate_client($input, $id); if (is_wp_error($data)) { return $data; }
        $title = trim($data['firstName'] . ' ' . $data['lastName']); if ($title === '') { $title = $data['company']; }
        $saved = wp_insert_post(array('ID' => $id, 'post_type' => self::CLIENT_TYPE, 'post_status' => 'private', 'post_title' => $title), true);
        if (is_wp_error($saved)) { return $saved; }
        self::persist_client($saved, $data);
        $response = new WP_REST_Response(self::client_record($saved), $id ? 200 : 201); $response->header('Cache-Control', 'private, no-store'); return $response;
    }
    public static function client_columns($columns) { return array('cb' => $columns['cb'], 'title' => 'Cliente', 'elite7_email' => 'Correo', 'elite7_phone' => 'Teléfono', 'elite7_company' => 'Empresa', 'date' => 'Fecha'); }
    public static function client_column($column, $id) { $data = self::client_record($id); $key = substr($column, 7); if (isset($data[$key])) { echo esc_html($data[$key]); } }
}
Elite7_WP2_Admin::boot();
add_action('admin_notices', function () {
    $error = get_transient('elite7_client_error_' . get_current_user_id());
    if ($error) { delete_transient('elite7_client_error_' . get_current_user_id()); echo '<div class="notice notice-error"><p>' . esc_html($error) . '</p></div>'; }
});
