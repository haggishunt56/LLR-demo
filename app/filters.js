module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  var filters = {

  }

  /* ------------------------------------------------------------------
    add your methods to the filters obj below this comment block:
    @example:

    filters.sayHi = function(name) {
        return 'Hi ' + name + '!'
    }

    Which in your templates would be used as:

    {{ 'Paul' | sayHi }} => 'Hi Paul'

    Notice the first argument of your filters method is whatever
    gets 'piped' via '|' to the filter.

    Filters can take additional arguments, for example:

    filters.sayHi = function(name,tone) {
      return (tone == 'formal' ? 'Greetings' : 'Hi') + ' ' + name + '!'
    }

    Which would be used like this:

    {{ 'Joel' | sayHi('formal') }} => 'Greetings Joel!'
    {{ 'Gemma' | sayHi }} => 'Hi Gemma!'

    For more on filters and how to write them see the Nunjucks
    documentation.

  ------------------------------------------------------------------ */
  filters.date = function (dateStr) {
    if (!(dateStr === undefined) && !(dateStr === null)) {
      // return (dateStr.toString().slice(4, 15)) // for use with PSQL

      // for sqlite3
      var date = new Date(dateStr)
      var mnthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      var dayArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      var day = dayArray[date.getDay()]
      var d = date.getDate()
      var m = mnthArray[date.getMonth()]
      var y = date.getFullYear()
      var retStr = '' + day + ' ' + d + ' ' + m + ' ' + y
      return retStr
    }
  }
  filters.trim = function (fullStr) {
    if (fullStr.length > 25) {
      var trimStr = fullStr.substring(0, 25)
      var newStr = trimStr.concat('...')
      return (newStr)
    } else {
      return (fullStr)
    }
  }
  filters.portfolioActive = function (active) {
    var retStr = ''

    if (active === 'true') {
      retStr = 'Yes'
    } else {
      retStr = 'No'
    }

    return retStr
  }
  filters.toLowerCase = function (str) {
    return str.toLowerCase()
  }

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
