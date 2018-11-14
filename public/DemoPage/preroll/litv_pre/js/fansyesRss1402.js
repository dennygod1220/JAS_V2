(function(){
    (function init(){
        $.ajax({
            type: 'GET',
            dataType: 'xml',
            //url: 'http://ws.fansyes.com/litv'
            url: 'https://tw.ws.fansyes.com/outlitv.aspx'
        }).then(function(doc){
            var data = parseRss(doc);
            //renderView(data.rssLink, data.items);
            renderView(data.items);
        }).fail(function(e){
            console.error(e);
        });
    }());
    
    function parseRss(doc){
        if(doc.xml){
            var parser = new DOMParser();
            doc = parser.parseFromString(doc.xml, 'text/xml');
        }

        var rss = findByName(doc, "themes", 1);
        var channel = findByName(rss[0], "theme", 1);
        //var rssLink = findByName(channel[0], "link", 1)[0].textContent;
        var items = findByName(channel[0], "item", 5).map(function(item){
            var title = findByName(item, "title", 1)[0].textContent;
            var link = findByName(item, "url", 1)[0].textContent;
            return {title: title, link: link};
        });
        
        //return {rssLink: "", items: items}
        return {items: items};
    }

    function findByName(doc, name, limit){
        if(typeof limit === "undefined"){
            limit = -1;
        }
        var r = [];
        for(var i = 0, ln = doc.childNodes.length; i < ln; i++){
            var d = doc.childNodes.item(i);
            if(d.nodeName == name) r.push(d);
            if(limit > -1 && r.length >= limit) break;
        }
        return r;
    }
    
    //function renderView(rssLink, items){
    function renderView(items){
        //var template = generateViewString(rssLink, items);
        var template = generateViewString(items);
        var creater = document.createElement('div');
        creater.innerHTML = template;
        var fansyessRssDom = creater.firstChild;
        
        var pos = document.querySelector("[data-fansyesrss]");
        if(pos){
            pos.parentNode.replaceChild(fansyessRssDom, pos);
        }
    }
    
    //function generateViewString(rssLink, items){
    function generateViewString(items){
        var template = '\
<div class="fansyes_rss">\
    <div class="fansyes_rss_header">\
        <div class="fansyes_rss_title">熱門新聞</div>\
    </div>\
    <ul class="fansyes_rss_list">{{items}}</ul>\
</div>';
        //        <a class="fansyes_rss_link" href="{{rssLink}}" target="_blank">更多娛樂新聞 ></a>\
        var itemTemplate = '<li><a href={{link}} target="_blank">{{title}}</a></li>';
        var itemsDomString = items.reduce(function(p, c){
            p.push(itemTemplate.replace("{{link}}", c.link).replace("{{title}}", c.title));
            return p;
        }, []).join("");
        //template = template.replace("{{rssLink}}", rssLink).replace("{{items}}", itemsDomString);
        template = template.replace("{{items}}", itemsDomString);
        
        return template;
    }
}());