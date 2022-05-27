var gumasLayer;


function getColor(nama_kec) 
{
		return 	nama_kec > 35000 ? '#800026' :
				nama_kec > 30000  ? '#BD0026' :
				nama_kec > 25000  ? '#E31A1C' :
				nama_kec > 20000  ? '#FC4E2A' :
				nama_kec > 15000   ? '#FD8D3C' :
				nama_kec > 10000   ? '#FEB24C' :
				nama_kec > 5000   ? '#FED976' :
				'#FFEDA0';
}

			
	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}

		info.update(layer.feature.properties);
	}
			
			function resetHighlight(e){

				gumasLayer.resetStyle(e.target);
			}
			
			
			
			function tampil(e){
				let kec = e.target;
				gumasLayer.bindPopup(
					`<table nowrap class="table table-bordered">
										<tr style ="line-height: 10px">
											<td nowrap>Nama Kecamatan : </td>
											<td nowrap><b>`+kec.feature.properties.Kecamatan+`<b></td>
											
										</tr>
										<tr style ="line-height: 15px">
											<td nowrap>Ibu Kota Kecamatan : </td>
											<td nowrap>`+kec.feature.properties.ibukota_ke+`</td>
										</tr>
										<tr style ="line-height: 10px">
											<td nowrap>Luas Kecamatan : </td>
											<td nowrap>`+kec.feature.properties.luas_km2+` Km<sup>2</sup</td>
										</tr>
										<tr style ="line-height: 12px">
											<td nowrap>Jumlah Penduduk : </td>
											<td nowrap>`+kec.feature.properties.jum_penduduk+` Orang</td>
										</tr>
					</table>`
				)

			}
			
			var markers = new Array();
		
			var markerskec = new Array();
			function kecOnEachFeature(feature, layer){
				markers.push(
					L.circleMarker(
						layer.getBounds().getCenter(),
						{
							radius : 0.0,
							opacity : 0,
							fillOpacity : 0
						}
					)
				);
				var markersCount = markers.length;
				markers[markersCount - 1].bindLabel(
					feature.properties.Kecamatan.toString(),
					{
							noHide : true,
							className : 'map-label',
							pane : 'mapPane',
							opacity:0.8,
							direction: 'auto'
							
					}
				);
				markers[markersCount - 1].addTo(map);

				layer.on(
					{
						mouseover : highlightFeature,
						mouseout : resetHighlight,
						click : tampil
					}
				);				
			}		


			// control that shows state info on hover
	

			function gumasStyle(feature){
				return {
					fillColor : getColor(feature.properties.jum_penduduk),
					weight : 2,
					opacity : 1,
					color : 'white',
					dashArray : 3,
					fillOpacity : 0.7,
				}
			}
		
			var map = L.map('map').setView([-1.1015078,113.8669906], 9);
			
			
			L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', 
			{
				attribution: 'Sumber Data : Kabupaten Gunung Mas Dalam Angka 2022 - BPS Kabupaten Gunung Mas',
				maxZoom: 18,
				id: 'mapbox/streets-v11',
				tileSize: 512,
				zoomOffset: -1,
				accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
			}).addTo(map);
			
			var legend = L.control({position: 'bottomright'});

			legend.onAdd = function (map) 
			{

			var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 5000, 10000, 15000, 20000, 25000, 30000, 35000],
			labels = [],
			from, to;

			for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
			};

			legend.addTo(map);

			gumasLayer = L.geoJson(
				gumas,
				{
					style : gumasStyle,
					onEachFeature : kecOnEachFeature
				}
			).addTo(map);

// control that shows state info on hover
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		this._div.innerHTML = '<h4>Jumlah Penduduk Kab. Gunung Mas <br/> Per Kecamatan (Tahun 2021)</h4>' +  (props ?
			'<b>Kecamatan ' + props.Kecamatan + '</b><br />' + props.jum_penduduk + ' Orang' 
			
			: 'Arahkan Kursor ke Kecamatan');
	};

	info.addTo(map);
	
	
			
			
