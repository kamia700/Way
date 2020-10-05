'use strict';

// tabs
(function () {
  let tab = function () {
  let tabNav = document.querySelectorAll('.tabs__item');
  let tabContent = document.querySelectorAll('.tabs__inset');
  let tabName;

  tabNav.forEach(item => {
    item.addEventListener('click', selectTabNav)
  });

  function selectTabNav() {
    tabNav.forEach (item => {
      item.classList.remove('active');
    });

    this.classList.add('active');
    tabName = this.getAttribute('data-tab-name');
    selectTabContent(tabName);
  }

  function selectTabContent(tabName) {
      tabContent.forEach (item => {
        item.classList.contains(tabName) ? item.classList.add('active') : item.classList.remove('active');
      })
    }
  };

  tab();

// burger
  var nav = document.querySelector('.page-header');
  var toggle = document.querySelector('.page-header__toggle');

  nav.classList.remove('page-header--nojs');
  nav.classList.add('page-header--close');

  toggle.addEventListener('click', function () {
    if (nav.classList.contains('page-header--open')) {
      nav.classList.remove('page-header--open');
      nav.classList.add('page-header--close');
    } else {
      nav.classList.remove('page-header--close');
      nav.classList.add('page-header--open');
    }
  });

  // validity
  var telInput = document.querySelectorAll('.tel');
  var mailInput = document.querySelectorAll('.mail');
  var form = document.querySelectorAll('form');


  var telInputHandler = function () {
    telInput.forEach(function (element) {
      if (element.validity.patternMismatch) {
        element.setCustomValidity('Пожалуйста, введите номер в формате +7 0000000000');
      } else if (element.validity.valueMissing) {
        element.setCustomValidity('Обязательное поле для заполнения');
      } else {
        element.setCustomValidity('');
      }
    });
  };

  var mailInputHandler = function () {
    mailInput.forEach(function (element) {
      if (element.validity.patternMismatch) {
        element.setCustomValidity('адрес должен включать символ @');
      } else {
        element.setCustomValidity('');
      }
    });
  };

  var changeBorderHandler = function () {
    form.forEach(function (element) {
      var inputs = Array.from(element.querySelectorAll('input:invalid:not(:placeholder-shown)'));

      inputs.forEach(function (el) {
        el.classList.add('validation-error');
      });
    });

    telInput.forEach(function (element) {
      element.removeEventListener('invalid', changeBorderHandler);
    });

    mailInput.forEach(function (element) {
      element.removeEventListener('invalid', changeBorderHandler);
    });
  };

  telInput.forEach(function (element) {
    element.addEventListener('input', telInputHandler);
    element.addEventListener('invalid', changeBorderHandler);
  });

  mailInput.forEach(function (element) {
    element.addEventListener('input', mailInputHandler);
    element.addEventListener('invalid', changeBorderHandler);
  });


  // modal popup
  var modal = document.querySelector('.modal');
  var close = document.querySelector('.modal__close');
  var open = document.querySelectorAll('.open__button');
  var inputFocus = document.querySelector('.modal__tel');

  var PopupEscPressHandler = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeModal();
    }
  };

  var openModal = function () {
    modal.classList.remove('hidden');
    inputFocus.focus();

    document.addEventListener('keydown', PopupEscPressHandler);
  }

  open.forEach(function (element) {
    element.addEventListener('click', openModal);
  });

  var closeModal = function () {
    modal.classList.add('hidden');

    document.removeEventListener('keydown', PopupEscPressHandler);
  };

  close.addEventListener('click', function () {
    closeModal();
  });


  // backend
    var TIMEOUT_IN_MS = 10000;

    var URL_POST = 'https://javascript.pages.academy/keksobooking';

    var StatusCode = {
      OK: 200
    };

    var createNewXhr = function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === StatusCode.OK) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = TIMEOUT_IN_MS;

      return xhr;
    };

    var save = function (data, onLoad, onError) {
      var xhr = createNewXhr(onLoad, onError);

      xhr.open('POST', URL_POST);
      xhr.send(data);
    };


    // message
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var mainBlock = document.querySelector('main');
    var successText = successTemplate.cloneNode(true);
    var errorText = errorTemplate.cloneNode(true);

    var resetForm = function () {
      form.forEach(function (element) {
          element.reset();
        });
    };

    var showMessage = function (result) {
      switch (result) {
        case 'success':
          document.body.appendChild(successText);
          resetForm();

          break;
        case 'error':
          mainBlock.appendChild(errorText);
          resetForm();
          break;
      }
      document.addEventListener('click', messageСloseHandler);
      document.addEventListener('keydown', messageСloseHandler);
    };

    var messageСloseHandler = function (evt) {
      var error = document.querySelector('.error');
      var success = document.querySelector('.success');

      if (error && (evt.keyCode === 27 || evt.button === 0)) {
        errorText.remove();
      } else
      if (success && (evt.keyCode === 27 || evt.button === 0)) {
        successText.remove();
      }
      document.removeEventListener('click', messageСloseHandler);
      document.removeEventListener('keydown', messageСloseHandler);
    };

    var successPostHandler = function () {
      showMessage('success');
    };

    var errorPostHandler = function () {
      showMessage('error');
    };

    var feedbackForm = document.querySelector('.feedback__form');

    var submitHandler = function (evt) {
      form.forEach(function (element) {
        save(new FormData(feedbackForm), successPostHandler, errorPostHandler);
      });

      evt.preventDefault();
    };

    form.forEach(function (element) {
      element.addEventListener('submit', submitHandler);
    });

})();
