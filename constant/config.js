var config = {
    CSE_ID: "007922341382056633096:hqs3lynnwl4",
    API_KEY: "AIzaSyA-TOIfXLWCIhpcat3kRP1lutSSXzeDzIE",
    DB_URL:"",
    isImageType: function(url) {
        return url.endsWith('.jpeg') || url.endsWith('.jpg') || url.endsWith('.gif') || url.endsWith('.png');
    }
}

module.exports = config;