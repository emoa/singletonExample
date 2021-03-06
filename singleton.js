'use strict';

let _ = require('underscore');

let property = key => obj => obj == null ? void 0 : obj[key];

let toString = Function.prototype.call.bind(Object.prototype.toString);

let isString = value => typeof value === 'string' || toString(value) === '[object String]';

let getLength = property('length');

const Color = (() => {
  let single;

  let init = function() {

    // private function to get three random values of color rgb
    let rgbRandomValues = function() {
      let values = [];
      for (let i = 0; i < 3; i++)
        values.push(Math.floor(Math.random() * 256));
      return values;
    };


    // private function to split a string in rows
    let splitIntoRows = function*(obj) {
      let length = getLength(obj),
        row = Number(arguments[1]) || 1,
        rowLength = Math.max(Math.min(row, length), 0),
        i = 0;

      while (i < length)
        yield(isString(obj) ? String : Array)
        .prototype.slice.call(obj, i, i += rowLength);
    };

    return {
      // methods to get a random color in formats rgb, rgb and hexadecimal
      random: {
        get rgb() {
          return 'rgb(' + rgbRandomValues().join(', ') + ')';
        },
        get rgba() {
          let values = rgbRandomValues();
          values.push(Math.random().toFixed(1));
          return 'rgba(' + values.join(', ') + ')';
        },
        get hex() {
          return '#' + rgbRandomValues().map(value => value.toString(16)).join('');
        }
      },
      // methods to transform rgb to hexadecimal and vice versa
      transform: {
        rgb(hex) {
          if (isString(hex) && hex.startsWith('#')) {
            let values = Array.from(splitIntoRows(hex.slice(1), 2)),
              rgb = values.map(value => parseInt(value, 16));
            return rgb.includes(NaN) || rgb.length < 3 ?
              null : 'rgb(' + rgb.join(', ') + ')';
          }
          return null;
        }
      }
    };
  };

  return {
    get instance() {
      if (!single)
        single = init();
      return single;
    }
  }
})();

// Testing

let color = Color.instance;

console.log(color);
/*{ random: { rgb: [Getter], rgba: [Getter], hex: [Getter] },
  transform: { rgb: [Function: rgb] } }*/

console.log(color.random.rgba); // rgba(148, 223, 71, 0.7)
console.log(color.random.hex); // #26107c

console.log(color.transform.rgb('#52f3b0')); // rgb(82, 243, 176)
console.log(color.transform.rgb('#$%&$%&')); // null
console.log(color.transform.rgb('#52f3')); // null