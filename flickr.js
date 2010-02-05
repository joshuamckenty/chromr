var key = '08be316ee5aaa43c0fb40c3d496d4a3c';

  function flickr(params, cb) {
    var qs = ["format=json", "nojsoncallback=1", "api_key="+key];
    for (var k in params) {
      qs.push(k + '=' + encodeURIComponent(params[k]));
    }

    var url = "http://api.flickr.com/services/rest/?" + qs.join("&");

    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        cb(JSON.parse(req.responseText));
      }
    }
    req.send();    
  }

  var photos = [];

  function flickr_update() { 
    flickr({
      method: 'flickr.photos.search',
      extras: 'media,o_dims,owner_name,icon_server',
      per_page: '500',
      media: 'photos',
      sort: 'interestingness-desc',
      tags: FLICKR_TAG,
    }, function(json) {
      photos = json.photos.photo;
      prime(0);
    });
  }


  function prime(forceidx) {
    if (forceidx) {
      idx = forceidx
    }
    else {
      idx = (idx + 1) % photos.length;
    }

    var ipJson = photos[idx];
    console.log('ipJson', ipJson);
    flickr({
      method: 'flickr.photos.getInfo',
      photo_id: ipJson.id
    }, function(json) {
      if (json.photo.media == 'photo') {
        primed = json.photo;
        // save the URL of the photo
        console.log(primed)
        // if (primed.originalformat) {
        //   primed.src = 'http://farm'+primed.farm+'.static.flickr.com/'+primed.server+'/'+primed.id+'_'+primed.originalsecret+'_o.'+primed.originalformat;
        // }
        if (Math.max(ipJson.o_height, ipJson.o_width) >= 1024) {
          // 1024 on longest side
          primed.src = 'http://farm'+primed.farm+'.static.flickr.com/'+primed.server+'/'+primed.id+'_'+primed.secret+'_b.jpg';
        }
        else {
          // 500 on longest side
          primed.src = 'http://farm'+primed.farm+'.static.flickr.com/'+primed.server+'/'+primed.id+'_'+primed.secret+'.jpg';
        }

        primed.buddyicon = 'http://farm'+ipJson.iconfarm+'.static.flickr.com/'+ipJson.iconserver+'/buddyicons/'+ipJson.owner+'.jpg';

        // precache image
        document.createElement('image').setAttribute('src', primed.src);
        document.createElement('image').setAttribute('src', primed.buddyicon);
      } 
      else {
        prime();
      }
    });
  }

  var idx=0;

  function flickr_getNext() {
    var next = primed;
    prime();
    return next;
  }

  setInterval(flickr_update, 60*60*1000); // update every hour
  flickr_update();
