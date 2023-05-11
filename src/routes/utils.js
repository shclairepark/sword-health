function convertUTCStringToTimestamp(utcString) {
  const utcDate = new Date(utcString);
  const timestamp = utcDate.toISOString().slice(0, 19).replace("T", " ");
  return timestamp;
}

module.exports.convertUTCStringToTimestamp = convertUTCStringToTimestamp;
