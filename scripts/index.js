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
window.$ = window.jQuery = require('jquery');

$( () => {
  // Make the <header> square.
  $('header').css({ 'height': $('header').css('width') });
  // Vertically center the logo <div> inside <header>.
  $('#logo').css({
    'top': ( $('header').height() - $('#logo').height() ) / 2  + 'px'
  });
  // Make the <nav> fill full height available for it.
  $('nav').css({
    'height': ( $(window).height() - $('header').height() ) + 'px'
  });
  // Make the #nav-tray <div> fill full height available.
  $('#nav-tray').css({
    'height': ( $('nav').height() - $('#nav-menu').height() ) + 'px'
  });

  // Hide or show the menu.
  $('#menu-button').on('click', (e) => {
    if ( $('nav').css('left') === '0px' ) {
      $('header').css('left', '-20%');
      $('nav').css('left', '-20%');
      $('main').css({
      	'width': '100%',
        'left': '0px'
      });
      $('#menu-button div').removeClass('active');
    } else {
      $('header').css('left', '0px');
      $('nav').css('left', '0px');
      $('main').css({
      	'width': '80%',
        'left': '20%'
      });
      $('#menu-button div').addClass('active');
    }
  });

  // Sets event listener to the .nav-menu <button>s.
  $('#menu_file').on('click', (e) => {
    $('#nav-tray').css('left', '0px');
    $('#nav-menu button:nth-child(1)').css('color', '#212121');
    $('#nav-menu button:not(#nav-menu button:nth-child(1))').css('color', '#9e9e9e');
  });
  $('#menu_format').on('click', (e) => {
    var w = $('nav').width();
    $('#nav-tray').css('left', '-' + w + 'px');
    $('#nav-menu button:nth-child(2)').css('color', '#212121');
    $('#nav-menu button:not(#nav-menu button:nth-child(2))').css('color', '#9e9e9e');
  });
  $('#menu_help').on('click', (e) => {
    var w = parseInt($('nav').width()) * 2;
    $('#nav-tray').css('left', '-' + w + 'px');
    $('#nav-menu button:nth-child(3)').css('color', '#212121');
    $('#nav-menu button:not(#nav-menu button:nth-child(3))').css('color', '#9e9e9e');
  });

});

function showDivs() {
  setTimeout(() => {
    $(':not(html)').css('opacity', '1');
  }, 1000);
}
