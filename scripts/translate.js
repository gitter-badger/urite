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

window.onload = function() {
  const {ipcRenderer} = require('electron');
  const handlebars    = require('handlebars');
  const i18n          = require('i18n');
  const fs            = require('fs');
  const settings      = require('electron-settings');

  // Configuring the i18n extension for possible translations.
  i18n.configure({
    locales:['en', 'pt_BR'],
    directory: __dirname + '/locales'
  });

  // This sets a 'function' for ``{{ i18n 'text' }}`` tags, so that i18n translate it properly.
  handlebars.registerHelper('i18n', function(str) {
    return i18n.__({
      phrase: str,
      locale: settings.getSync('locale')
    });
  });

  handlebars.registerHelper('app', function(str) {
    // First we load the package configuration JSON file into a JSON object.
    var conf = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    // Then we output accorindingly.
    switch (str) {
      case 'name':
        return conf.name;
        break;
      case 'author_name':
        return conf.author.name;
        break;
      case 'author_email':
        return conf.author.email;
        break;
      case 'author_url':
        return conf.author.url;
        break;
      case 'version':
        return conf.version;
        break;
      case 'homepage':
        return conf.homepage;
        break;
      case 'copy_year':
        return conf.year;
        break;
      default:
        return 'N/A';
    }
  });

  // Now we process the document.
  var template = handlebars.compile(document.documentElement.innerHTML);
  document.documentElement.innerHTML = template();

  // And we notify ipc that translation is done.
  ipcRenderer.send('asynchronous-message', 'i18n-done');
};
