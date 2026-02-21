// Как только страничка загрузилась 
  window.onload = function () { 
    // проверяем поддерживает ли браузер FormData 
    if(!window.FormData) {
      alert("Браузер не поддерживает загрузку файлов на этом сайте");
    }
  }

// Стандарный input для файлов
  var fileInput = $('#file');
  
  // ul-список, содержащий миниатюрки выбранных файлов
  var imgList = $('ul#img-list');
  
  // Контейнер, куда можно помещать файлы методом drag and drop
  var dropBox = $('#img-container');
 
  // Обработка события выбора файлов в стандартном поле
  fileInput.bind({
    change: function() {
      displayFiles(this.files);
    }
  });
     
  // Обработка событий drag and drop при перетаскивании файлов на элемент dropBox
  dropBox.bind({
    dragenter: function() {
      $(this).addClass('highlighted');
      return false;
    },
    dragover: function() {
      return false;
    },
    dragleave: function() {
      $(this).removeClass('highlighted');
      return false;
    },
    drop: function(e) {
      var dt = e.originalEvent.dataTransfer;
      displayFiles(dt.files);
      return false;
    }
});
  

function displayFiles(files) {
    $.each(files, function(i, file) {      
                 
      // Создаем элемент li и помещаем в него название, миниатюру и progress bar,
      // а также создаем ему свойство file, куда помещаем объект File (при загрузке понадобится)
      var li = $('<li/>').appendTo(imgList);
      $('<p/>').text(file.name).appendTo(li);
      /* var img = $('<img/>').appendTo(li); */
      /* $('<div/>').addClass('progress').text('0%').appendTo(li);
      li.get(0).file = file; */
 
      // Создаем объект FileReader и по завершении чтения файла, отображаем миниатюру и обновляем
      // инфу обо всех файлах
      var reader = new FileReader();
      reader.onload = (function(aImg) {
        return function(e) {
          /* aImg.attr('src', e.target.result); */
          aImg.attr('width', 150);
          /* ... обновляем инфу о выбранных файлах ... */
        };
      });
      
      reader.readAsDataURL(file);
    });
 }

/*jQuery(document).ready(function(){
	// =validation
	var errorTxt = 'Ошибка отправки';
	jQuery("#contactform").validate({
		submitHandler: function(form){
			var form = document.forms.contactform,
				formData = new FormData(form),
				xhr = new XMLHttpRequest();
				
			xhr.open("POST", "contactform.php");
			
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if(xhr.status == 200) {
						jQuery("#contactform").html('<p class="thank">Заявка на просмотр  отправлена!<p>');
					}
				}
			};
			xhr.send(formData);
		}
	});	
})

function sendSuccess(callback){
	jQuery(callback).find("form").html(thank);
	startClock();
}*/
formValidation();
function formValidation() {
    var $form = $("form[id='contactform'].form");

    $form.validate({
        rules: {
            name: {
                required: true
            },
            phone: {
                required: true
            },
            agreement: {
                required: true
            }
        },
        messages: {
            name: {
                required: "Как Вас зовут?"
            },
            phone: {
                required: "Укажите номер телефона"
            },
            agreement: {
                required: "Согласие обязательно"
            }
        },
        errorClass: "form-input--invalid", // класс при не правильном вводе добавляется элементу
        validClass: "form-input--valid", // класс при правильном вводе добавляется элементу
        focusCleanup: true, // по фокусу в поле убирается класс показывающий ошибку
        focusInvalid: false, // убирает фокус курсора в первом инпуте по-умолчанию при отправке формы
        onkeyup: true, // проверка при каждом нажатии клавиши с клавиатуры
        // errorPlacement: function(error, element) { // скрываем все подписи с ошибками
        // 	return true;
        // },
        onfocusout: function (element) { // по убиранию фокуса с поля - поле валидируется
            this.element(element);
            console.log(this.element(element));
        },
        invalidHandler: function (event, validator) {
            $(".js-form-message").text("Исправьте пожалуйста все ошибки.");
        }, // выводим блок message  с текстом в котором показываем текст
        // submitHandler: function(form) {
        // 	alert("form valid");
        // 	// $(form).ajaxSubmit(); // отправка аяксом
        // 	// form.submit(); // отправка простая
        // },
        submitHandler: function (form) {
            $.ajax({
                url: form.action,
                type: form.method,
                data: $form.serialize(),
                success: function (response) {
                    var msg = response['message'];
                    $(form).fadeOut(100, function () {
                        form.html(msg).fadeIn();
                    });
                    $('.answers').html(msg);
                }
            });
        }
    });
}