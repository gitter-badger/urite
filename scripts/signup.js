/*
 * This file is part of urite.
 *
 * urite is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * urite is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with urite.  If not, see <http://www.gnu.org/licenses/>.
 */

const {ipcRenderer} = require('electron');
const settings      = require('electron-settings');
window.$ = window.jQuery = require('jquery');

$(() => {
  // Keeping track of the window's size for ease of access later.
  let win_hp = $(window).height() + 'px';
  let win_hm = '-' + win_hp;
  let interface_empty = $('#confirm-name').text();

  // Make the <header> square.
  $('header').css('height', $('header').css('width'));
  // Vertically center the logo <div> inside <header>.
  $('#logo').css({
    'top': ( $('header').height() - $('#logo').height() ) / 2  + 'px'
  });
  // Make the <nav> fill full height available for it.
  $('nav').css({
    'height': $(window).height() - $('header').height() + 'px'
  });
  // Make each .step <div> full-page-height.
  $('div.step').css({ 'height': win_hp });
  // Vertically center the content of the <div>s inside each .step <div>.
  $.each([1, 2, 3, 4, 5], (i, v) => {
    $('#div-' + v + ' div').css({
      'top': ( $('#div-' + v).height() - $('#div-' + v + ' div').height() ) / 2  + 'px'
    });
  });
  // Position the .step <div>s in their corresponding Y height.
  $('.div-now').css({ 'top': '0px' });
  $('.div-later').css({ 'top': win_hp });

  // Make each keystroke on the name <input>s change the verification card, and also checks for validity.
  // If valid, enables the saving <button>, if not disables it.
  $('#form-name-first, #form-name-last').on('keyup', () => {
    if ( $('#form-name-first:valid').length && $('#form-name-last:valid').length ) {
      $('#confirm-name').text( $('#form-name-first').val() + ' ' + $('#form-name-last').val() );
      $('button.confirm').attr('disabled', false);
    } else {
      $('#confirm-name').text( interface_empty );
      $('button.confirm').attr('disabled', true);
    }
  });

  // Change the verification card each time the language is changed.
  $('#form-locale').on('change', (e) => {
    $('#confirm-lang').text( $('#form-locale :selected').text() );
  });

  // Action for the .next <buttons>.
  $('button.next').on('click', (e) => {
    var patt    = /\d/;
    var current = patt.exec( $('.div-now').attr('id') );
    var next = parseInt(current) + 1;

    $('#div-' + current)                     // 1. Changes to the .div-now <div>:
        .css('top', win_hm)                  //    - Top property to off screen above;
        .removeClass('div-now')              //    - Removes the .div-now class;
        .addClass('div-done')                //    - Adds the .div-done class;
        .find('input, button, select, a')    //    - Gets every <input>, <button>, <select> and <a> inside it...
            .attr('tabindex', '-1');         //    - ...and makes them unreachable through TAB key.
    $('#li-' + current).removeClass('now');  // 2. Removes current <li>'s .now class.
    $('#div-' + next)                        // 3. Changes to the next <div>:
        .css('top', '0px')                   //    - Top property to y = 0px;
        .removeClass('div-later')            //    - Removes the .div-later class;
        .addClass('div-now')                 //    - Adds the .div-now class;
        .find('input, button, select, a')    //    - Gets every <input>, <button>, <select> and <a> inside it...
            .attr('tabindex', '0');          //    - ...and makes them reachable through TAB key.
    $('#li-' + next).addClass('now');        // 4. Adds .now class to next <li>.
  });

  // Action for the .prev(ious) <buttons>.
  $('button.prev').on('click', (e) => {
    var patt    = /\d/;
    var current = patt.exec( $('.div-now').attr('id') );
    var prev = parseInt(current) - 1;

    $('#div-' + current)                     // 1. Changes to the .div-now <div>:
        .css('top', win_hp)                  //    - Top property to off screen below;
        .removeClass('div-now')              //    - Removes the .div-now class;
        .addClass('div-later')               //    - Adds the .div-later class;
        .find('input, button, select, a')    //    - Gets every <input>, <button>, <select> and <a> inside it...
            .attr('tabindex', '-1');         //    - ...and makes them unreachable through TAB key.
    $('#li-' + current).removeClass('now');  // 2. Removes current <li>'s .now class.
    $('#div-' + prev)                        // 3. Changes to the previous <div>:
        .css('top', '0px')                   //    - Top property to y = 0px;
        .removeClass('div-done')             //    - Removes the .div-done class;
        .addClass('div-now')                 //    - Adds the .div-now class;
        .find('input, button, select, a')    //    - Gets every <input>, <button>, <select> and <a> inside it...
            .attr('tabindex', '0');          //    - ...and makes them reachable through TAB key.
    $('#li-' + prev).addClass('now');        // 4. Adds .now class to previous <li>.
  });

  // Action for the .save <button>.
  $('button.save').on('click', (e) => {
    // First we double-check if all fields are valid.
    if ( $('#form-name-first:valid').length && $('#form-name-last:valid').length && $('#form-locale').val() ) {
      // If all fields are, indeed, valid, then we proceed.
      $('button.save').attr('disabled', true);    // First we disable this button, so this method is only called once.
      $('#div-5 .loader').removeClass('hidden');  // Then we show the loading animation.
      settings.setSync('name', {                  // Now we save the user name.
        'first': $('#form-name-first').val(),
        'last': $('#form-name-last').val()
      });
      settings.setSync('locale', $('#form-locale').val());

      // Now finishing.
      setTimeout( () => {
        // Once all is saved, we dim out.
        $(':not(html)').css('opacity', '0');
        setTimeout(() => {
          // Lastly, we send to the main process that the signing up is done.
          ipcRenderer.send('asynchronous-message', 'signup-done');
        }, 1000);
      }, 1500);

    } else {
      // If any of them is invalid, then we run back to step one.
      $('#div-1 .error').removeClass('hidden');     // 1. First we show the error message in the first <div>.
      $('button.confirm').attr('disabled', true);   // 2. Then we disable the .confirm <button> so the user cannot get the error out of fun.
      $('.div-now')                                 // 3. Changes to the current <div>:
          .css('top', win_hp)                       //    - Top property to off screen below;
          .removeClass('div-now')                   //    - Removes the .div-now class;
          .addClass('div-later')                    //    - Adds the .div-later class;
          .find('input, button, select, a')         //    - Gets every <input>, <button>, <select> and <a> inside it...
              .attr('tabindex', '-1');              //    - ...and makes them unreachable through TAB key.
      $('.div-done:not(#div-1)')                    // 4. Changes to the all the previous <div>s, except the first one:
          .css('top', win_hp)                       //    - Top property to off screen below;
          .removeClass('div-done')                  //    - Removes the .div-done class;
          .addClass('div-later');                   //    - Adds the .div-later class.
      $('#div-1')                                   // 5. Changes to the first <div>:
          .css('top', '0px')                        //    - Top property to y = 0px;
          .removeClass('div-done')                  //    - Removes the .div-done class;
          .addClass('div-now')                      //    - Adds the .div-now class;
          .find('input, button, select, a')         //    - Gets every <input>, <button>, <select> and <a> inside it...
              .attr('tabindex', '0');               //    - ...and makes them reachable through TAB key.
      $('li.now').removeClass('now');               // 6. Removes current <li>'s .now class.
      $('#li-1').addClass('now');                   // 7. Adds .now class to the first <li>.
    }
  });

  // Select the current language between the <select>'s <option>s.
  $('#form-locale').val( settings.getSync('locale') );
  // Set the default language into the confirmation card.
  $('#confirm-lang').text( $('#form-locale :selected').text() );
});

function showDivs() {
  setTimeout(() => {
    $(':not(html)').css('opacity', '1');
  }, 1000);
}
