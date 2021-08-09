const { randomGenerator } = require('./randomGenerator');

function maxRetryChecker(value) {
  return value >= 1 ? (value % 1 === 0 ? value : Math.ceil(value)) : 5;
}
function timeRangeChecker(value) {
  return randomGenerator(0.1, value < 1 ? 1 : value) * 1000;
}
module.exports = { maxRetryChecker, timeRangeChecker };
