ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
            center: [54.600703, 39.827320],
            zoom: 16,
			controls: []
        }, {
            searchControlProvider: 'yandex#search'
        }),

        // Создаём макет содержимого.
        MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
        ),

        myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            hintContent: '«Эволюция» - первый современный фитнес-клуб нового формата',
            balloonContent: 'г. Рязань,  р-он Дашково-Песочня, ул. Новосёлов, д. 53Д'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: '/static/global/img/icon-location.svg',
            // Размеры метки.
            iconImageSize: [87, 110],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-43, -110]
        });

        myMap.geoObjects
        .add(myPlacemark);

	  // Создадим пользовательский макет ползунка масштаба.
        ZoomLayout = ymaps.templateLayoutFactory.createClass("<div>" +
            "<div id='zoom-in' class='btn-map'><span>+</span></div><br>" +
            "<div id='zoom-out' class='btn-map'><span>-</span></div>" +
            "</div>", {

            // Переопределяем методы макета, чтобы выполнять дополнительные действия
            // при построении и очистке макета.
            build: function () {
                // Вызываем родительский метод build.
                ZoomLayout.superclass.build.call(this);

                // Привязываем функции-обработчики к контексту и сохраняем ссылки
                // на них, чтобы потом отписаться от событий.
                this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
                this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

                // Начинаем слушать клики на кнопках макета.
                $('#zoom-in').bind('click', this.zoomInCallback);
                $('#zoom-out').bind('click', this.zoomOutCallback);
            },

            clear: function () {
                // Снимаем обработчики кликов.
                $('#zoom-in').unbind('click', this.zoomInCallback);
                $('#zoom-out').unbind('click', this.zoomOutCallback);

                // Вызываем родительский метод clear.
                ZoomLayout.superclass.clear.call(this);
            },

            zoomIn: function () {
                var map = this.getData().control.getMap();
                map.setZoom(map.getZoom() + 1, {checkZoomRange: true});
            },

            zoomOut: function () {
                var map = this.getData().control.getMap();
                map.setZoom(map.getZoom() - 1, {checkZoomRange: true});
            }
        }),
        zoomControl = new ymaps.control.ZoomControl({options: {layout: ZoomLayout}});
		
    myMap.controls.add(zoomControl, {
        position: {
            bottom: 15,
            right: 15
        }
    });
		
//отключаем зум колёсиком мышки
myMap.behaviors.disable('scrollZoom');

//на мобильных устройствах... (проверяем по userAgent браузера)
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    //... отключаем перетаскивание карты
    myMap.behaviors.disable('drag');
}

// ON RESIZE
//Get curent center and zoom
   var pixelCenter = myMap.getGlobalPixelCenter('map_page');
   console.log(pixelCenter);

//
function onResizeMap() {
   if ($(window).width() > '991') { 
   //Set New center
   myMap.setCenter([54.601214, 39.821789]);
   var pixelCenter2 = myMap.getGlobalPixelCenter('map_page');
   console.log(pixelCenter2);
    } else {
      myMap.setCenter([54.600703, 39.827320]);
    }
    } onResizeMap();
     window.onresize = function () {
       onResizeMap();
   };
});

//hiddden-container

$('.time-item').click(function(){
  $('.hiddden-container').addClass('open');
});
$('.close-hidden').click(function(){
  $('.hiddden-container').removeClass('open');
});
$(document).mouseup(function(e) {
  var $target = $(e.target);
  if ($target.closest(".hiddden-container").length == 0 && $target.closest(".close-hidden").length == 0) {
    $(".hiddden-container").removeClass("open");
  }
});

