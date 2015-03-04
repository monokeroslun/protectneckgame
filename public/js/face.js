/*
 * 判断向左还是向右，注意需要引入facepp-sdk.min.js，canvas-to-blob.js
 * @author Lei Ding
 * @params canvas, html5 canvas
 *         api_key, face++ API key
 *         api_secret, face++ API secret
 *         callback, callback function
 * @return error code of face++, if error occurs
 *         -1, left
 *         1, right
 */
function leftOrRight(canvas, api_key, api_secret, callback) {
    canvas.toBlob(function(blob) {
        var api = new FacePP(api_key, api_secret);
        api.request('detection/detect', {
            attribute: "pose",
            img: blob
        }, function(err, result, callback) {
            if (err) {
                callback(err);
            } else {
                // TODO use _kresult
                var posea = result['face'][0].attribute.pose.roll_angle.value;
                var posenumber = parseFloat(posea);
                if (posenumber > 20) {
                    callback(-1);
                } else if (posenumber < (-20)) {
                    callback(1);
                }
            }
        });
    }, 'image/jpeg');

}
