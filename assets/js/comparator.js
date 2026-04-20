class PropertyComparator {
  constructor() {
    this.selected = [];
    this.maxProperties = 3;
    this.properties = [
      {id:0,n:'Casa Montaña del Valle',l:'Valle Oriente',p:'$12,500,000',a:'620 m²',roi:'4.2%',app:'Alto'},
      {id:1,n:'Penthouse Vistas',l:'Del Valle',p:'$8,900,000',a:'280 m²',roi:'5.1%',app:'Muy Alto'},
      {id:2,n:'Villa Serena',l:'San Agustín',p:'$18,200,000',a:'850 m²',roi:'3.8%',app:'Alto'},
      {id:3,n:'Residencia Altos',l:'Colinas',p:'$4,600,000',a:'380 m²',roi:'4.5%',app:'Medio'},
      {id:4,n:'Terreno Sierra',l:'San Jerónimo',p:'$3,200,000',a:'1,200 m²',roi:'3.9%',app:'Medio'},
      {id:5,n:'Sky Residence',l:'Carr. Nacional',p:'$6,800,000',a:'320 m²',roi:'4.8%',app:'Alto'}
    ];
  }

  addProperty(propertyId) {
    if (this.selected.includes(propertyId)) {
      this.removeProperty(propertyId);
      return;
    }
    if (this.selected.length < this.maxProperties) {
      this.selected.push(propertyId);
      this.updateUI();
    } else {
      this.toast('Máximo 3 propiedades para comparar');
    }
  }

  removeProperty(propertyId) {
    this.selected = this.selected.filter(id => id !== propertyId);
    this.updateUI();
  }

  updateUI() {
    const badge = document.getElementById('comp-badge');
    if (badge) {
      badge.textContent = this.selected.length;
      badge.style.display = this.selected.length > 0 ? 'flex' : 'none';
    }
    document.querySelectorAll('.pi').forEach(el => {
      const id = parseInt(el.dataset.id || el.dataset.propId);
      if (this.selected.includes(id)) {
        el.classList.add('selected');
      } else {
        el.classList.remove('selected');
      }
    });
  }

  open() {
    if (this.selected.length < 2) {
      this.toast('Selecciona al menos 2 propiedades');
      return;
    }
    this.renderComparison();
    document.getElementById('comp-overlay').classList.add('open');
  }

  close() {
    document.getElementById('comp-overlay').classList.remove('open');
  }

  renderComparison() {
    const container = document.getElementById('comp-table');
    const selectedProps = this.selected.map(id => this.properties[id]);

    let html = '<table class="comp-tbl"><tbody>';
    html += '<tr class="comp-row-header"><td class="comp-header-cell"></td>';
    selectedProps.forEach(p => {
      html += `<td class="comp-header-cell">${p.n}</td>`;
    });
    html += '</tr>';

    const fields = [
      {label: 'Ubicación', key: 'l'},
      {label: 'Precio', key: 'p'},
      {label: 'Área', key: 'a'},
      {label: 'ROI Anual', key: 'roi'},
      {label: 'Apreciación', key: 'app'}
    ];

    fields.forEach(field => {
      html += `<tr class="comp-row"><td class="comp-label">${field.label}</td>`;
      selectedProps.forEach(p => {
        html += `<td class="comp-value">${p[field.key]}</td>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;
  }

  openContactOptions() {
    const whatsappBtn = document.getElementById('comp-wa');
    const formBtn = document.getElementById('comp-form');

    if (whatsappBtn) {
      whatsappBtn.onclick = () => {
        const props = this.selected.map(id => this.properties[id].n).join(', ');
        window.open(`https://wa.me/528112345678?text=Estoy interesado en comparar: ${props}`, '_blank');
      };
    }

    if (formBtn) {
      formBtn.onclick = () => {
        this.close();
        document.getElementById('form-overlay').classList.add('open');
      };
    }
  }

  toast(msg) {
    const t = document.getElementById('toast');
    if (t) {
      t.textContent = msg;
      t.classList.add('on');
      setTimeout(() => t.classList.remove('on'), 3800);
    }
  }
}

const propertyComparator = new PropertyComparator();
