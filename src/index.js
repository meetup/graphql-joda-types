'use strict';
exports.__esModule = true;
var graphql_1 = require('graphql');
var joda = require('js-joda');
var jodaToGraphql = function(name, description, jodaType, parser) {
  var parse = function(value) {
    try {
      return parser(value);
    } catch (e) {
      throw new TypeError(
        name + ' can not represent an invalid string ' + value
      );
    }
  };
  var config = {
    name: name,
    description: description,
    serialize: function(value) {
      if (value instanceof jodaType) {
        return value.toString();
      }
      if (typeof value === 'string') {
        parse(value); // will throw if it's invalid
        return value;
      }
      throw new TypeError(
        name + ' can not represent invalid type ' + JSON.stringify(value)
      );
    },
    parseValue: function(value) {
      if (typeof value === 'string') {
        return parse(value);
      }
      throw new TypeError(
        name + ' can not represent non-string type ' + JSON.stringify(value)
      );
    },
    parseLiteral: function(ast) {
      if (ast.kind !== graphql_1.Kind.STRING) {
        throw new TypeError(
          name +
            ' can not represent non-string type ' +
            String(ast.value != null ? ast.value : null)
        );
      }
      return parse(ast.value);
    },
  };
  return new graphql_1.GraphQLScalarType(config);
};
exports.LocalDate = jodaToGraphql(
  'LocalDate',
  'A date string, such as 2018-07-01, serialized in ISO8601 format',
  joda.LocalDate,
  joda.LocalDate.parse
);
exports.LocalDateTime = jodaToGraphql(
  'LocalDateTime',
  'A date and time, such as 2018-07-01T12:00:00, without a timezone, serialized in ISO8601 format',
  joda.LocalDateTime,
  joda.LocalDateTime.parse
);
exports.LocalTime = jodaToGraphql(
  'LocalTime',
  'A time string, such as 12:00:00, serialized in ISO8601 format',
  joda.LocalTime,
  joda.LocalTime.parse
);
exports.ZonedDateTime = jodaToGraphql(
  'ZonedDateTime',
  'A specific moment in time, such as 2018-07-01T12:00:00-04:00, serialized in ISO8601 format',
  joda.ZonedDateTime,
  joda.ZonedDateTime.parse
);
exports.ZoneId = jodaToGraphql(
  'ZoneId',
  'A timezone ID from the IANA timezone database, such as America/New_York or UTC',
  joda.ZoneId,
  joda.ZoneId.of
);
