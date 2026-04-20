class ROICalculator {
  constructor() {
    this.init();
  }

  init() {
    ['roi-precio', 'roi-apreciacion', 'roi-anios', 'roi-renta'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.calculate());
      }
    });
    this.calculate();
  }

  calculate() {
    const precio = parseFloat(document.getElementById('roi-precio')?.value) || 0;
    const apreciacion = parseFloat(document.getElementById('roi-apreciacion')?.value) || 6;
    const anios = parseFloat(document.getElementById('roi-anios')?.value) || 5;
    const renta = parseFloat(document.getElementById('roi-renta')?.value) || 0;

    const valorFinal = precio * Math.pow(1 + apreciacion / 100, anios);
    const gananciaCapital = valorFinal - precio;
    const rentaTotal = renta * 12 * anios;
    const retornoTotal = gananciaCapital + rentaTotal;
    const roiPct = precio > 0 ? (retornoTotal / precio * 100) : 0;
    const roiAnual = precio > 0 && anios > 0 ? (roiPct / anios) : 0;

    this.set('roi-r-final', this.fmt(valorFinal));
    this.set('roi-r-ganancia', this.fmt(gananciaCapital));
    this.set('roi-r-renta', this.fmt(rentaTotal));
    this.set('roi-r-total', this.fmt(retornoTotal));
    this.set('roi-r-pct', roiPct.toFixed(1) + '%');
    this.set('roi-r-anual', roiAnual.toFixed(1) + '%');

    const resultNum = document.getElementById('roi-result-num');
    if (resultNum) {
      resultNum.textContent = roiPct.toFixed(1) + '%';
    }
  }

  fmt(n) {
    return '$' + Math.round(n).toLocaleString('es-MX') + ' MXN';
  }

  set(id, val) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = val;
    }
  }
}

window.roiCalculator = new ROICalculator();
