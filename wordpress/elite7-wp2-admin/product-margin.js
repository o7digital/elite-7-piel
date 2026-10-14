(function () {
  "use strict";
  function initialize() {
    var panel = document.getElementById("elite7_specials_panel");
    if (!panel) return;
    function input(key) { return document.getElementById("elite7_" + key); }
    function amount(key) { var element = input(key); return element ? Number(element.value.replace(",", ".")) : 0; }
    function calculate() {
      var purchase = input("purchasePrice");
      var margin = input("realMargin");
      var profit = input("profit");
      if (!margin || !profit) return;
      if (!purchase || !purchase.value.trim()) { margin.value = "Por definir"; profit.value = "Por definir"; return; }
      var mode = input("shippingMode");
      var revenue = amount("salePrice") + (mode && mode.value === "separate" ? amount("shippingCharge") : 0);
      var cost = amount("purchasePrice") + amount("shippingCost") + amount("packagingCost") + revenue * amount("feePercent") / 100;
      profit.value = Number.isFinite(revenue - cost) ? (revenue - cost).toFixed(2) : "Por definir";
      margin.value = revenue > 0 && Number.isFinite(cost) ? ((revenue - cost) / revenue * 100).toFixed(2) : "Por definir";
    }
    panel.addEventListener("input", calculate);
    panel.addEventListener("change", calculate);
    calculate();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
  else initialize();
})();
