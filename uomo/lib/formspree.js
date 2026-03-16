export const FORMSPREE_ENDPOINT = "https://formspree.io/f/xyknngqo";

export async function submitFormspree(formData) {
  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  if (response.ok) {
    return;
  }

  let errorMessage = "No se pudo enviar el formulario.";

  try {
    const payload = await response.json();
    if (payload?.errors?.[0]?.message) {
      errorMessage = payload.errors[0].message;
    }
  } catch {
    // Ignore JSON parsing errors and fall back to the default message.
  }

  throw new Error(errorMessage);
}
