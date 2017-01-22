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

/**
 * Dims the Splash screen after 3s, then sends a signal to the main process that the splash time ended.
 *
 * @return  null
 */
function closeSplash() {
  setTimeout(function() {
    $(":not(html)").css("opacity", "0");
    setTimeout(function() {
      ipcRenderer.send('asynchronous-message', 'splash-done');
    }, 2000);
  }, 3000);

  // Set return value to null.
  return null;
}

$(window).on('load', () => {
  // Vertically centers the Main div.
  $('main').css({
    'top': ( $(window).height() - $('main').height() ) / 2  + "px"
  });
});
