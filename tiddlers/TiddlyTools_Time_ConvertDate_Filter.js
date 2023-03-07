/*\
title: TiddlyTools/Time/ConvertDate/Filter
type: application/javascript
module-type: filteroperator
original-source: http://TiddlyTools.com/timer.html
author: EricShulman

Filter operator to convert formatted dates to another format.

To convert datetime values to a different format, use filter syntax `[convertdate[outputformat]]`.

Input values:
* The inputs can use any datetime values that are recognized by the Javascript Date.parse() function and conforms to [[ISO 8601 standard date format|https://en.wikipedia.org/wiki/ISO_8601]].
* Datetime values can also include English day number suffixes ("st", "nd", "rd", and "th"), which are generally not recognized by the ISO 8601 standard.  These suffixes are automatically removed before further processing.
* Alternatively, the input values can be signed integers, representing the number of milliseconds since midnight 01 January, 1970 UTC (the [[ECMAScript epoch|https://en.wikipedia.org/wiki/Epoch_(computing)]]). Negative numbers represent datetime values before that date.

Output formats:
* The output format uses [[TiddlyWiki Date Format codes|https://tiddlywiki.com/#DateFormat]] and defaults to `[UTC]YYYY0MM0DD0hh0mm0ss0XXX`.
* Alternatively, the output format can be the keyword `timestamp`, which converts the input values into the number of milliseconds since midnight 01 January, 1970 UTC.

Local vs. UTC time:
* Datetime input values use the local timezone of your system. If the `[UTC]` prefix is included in the output format operand, your locale's [[timezone offset|https://en.wikipedia.org/wiki/List_of_UTC_time_offsets]] will be applied to convert the result to UTC standard time. If you omit the `[UTC]` prefix from the output format operand, no conversion will occur and the result will be expressed using your local timezone, without adjusting for your timezone offset.
* Output format operands containing `[UTC]` cannot be directly entered into ~TiddlyWiki filter syntax, because that syntax uses `[` and `]` to enclose literal text operand values.  To work around this limitation you can use a reference to a variable that contain the operand value, like this:

<$vars format="[UTC]0hh:0mm:0ss">{{{ [[July 24 1962 02:00:00]convertdate<format>] }}}

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.convertdate = function(source,operator,options) {
   const re        = /(\d+)(st|nd|rd|th)/;  /* removes day number suffixes */
   var   format    = operator.operand || "[UTC]YYYY0MM0DD0hh0mm0ss0XXX";
   var   results   = [];

   source(function(tiddler,title) {
      if (format=="timestamp") {
         results.push(new Date(title.replace(re,"$1")).getTime().toString());
      } else {
         if (title.match(/^-?\d+$/)) {
            results.push($tw.utils.formatDateString(new Date(Number(title)),format));
         } else {
            results.push($tw.utils.formatDateString(new Date(title.replace(re,"$1")),format));
         }
      }
   });
   return results;
};

})();