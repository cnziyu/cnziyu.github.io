    var current_content = '';
    var current_json_str = '';
    var current_json_html = '';
    var xml_flag = false;
    var zip_flag = false;
    var shown_flag = false;
    var compress_flag = false;

    function checkDomain() {
        const currentDomain = window.location.hostname;
        prefix = "json2.top";
        if (currentDomain === "") {
            return true;
        }
       if (currentDomain.indexOf(prefix) != -1) {
            return true;
       }
       throw new Error("非法访问");
    }

      $("#json-src").keyup(function() {
            parseJson();
        });

      function generateBlank(level) {
        var blank = "";
        for (var index = 0; index < level; index++) {
            blank += "&nbsp;&nbsp;&nbsp;&nbsp;";
        }
        return blank;
      }

      function parseJson() {
        checkDomain();
        var textarea = document.getElementById("json-src");
        var content = textarea.value;
        content = content.trim();
        var length = content.length;
        if (content === "") {
           $('#json-target').html('');
           current_json_str = '';
           current_content = '';
           zip_flag = false;
           xml_flag = false;
           $(".zip").attr('style', 'color:#999;');
           $(".xml").attr('style', 'color:#999;');
           return;
        }
        // 将 JSON 字符串解析为 JavaScript 对象
        const obj = JSON.parse(content);

        current_json_str = JSON.stringify(obj);
        current_content = content;
        // console.log(obj);

        var html = stringifyToHtml(obj, 1);
        current_json_html = html;
        $('#json-target').html(html);
        // console.log("html = " + html);
        // console.log("输入内容的长度为：" + length);
        zip_flag = false;
        xml_flag = false;
        $(".zip").attr('style', 'color:#999;');
        $(".xml").attr('style', 'color:#999;');
      }

      function stringifyToHtml(obj, level) {
        if (obj === null) {
            return "<span class=\"json_null\" contenteditable=\"true\">null</span>";
        } else if (obj === "") {
            return "<span class=\"json_null\" contenteditable=\"true\">\"\"</span>";
        } else if (Array.isArray(obj)) {//说明是数组结构
            //console.log(obj);
            var str = "<span data-type=\"array\" data-size=\"" + obj.length + "\">" +
            "<i style=\"cursor:pointer;\" class=\"fa fa-minus-square-o\" onclick=\"hide(this)\"></i>" + "[<br>";
            var blank = generateBlank(level);
            if (obj.length > 0) {
                for (let i = 0; i < obj.length; i++) {
                    const item = obj[i];
                    var json_value = stringifyToHtml(item, level + 1);
                    if (i == obj.length - 1) {
                        json_value += "<br>";
                    } else {
                        json_value += ",<br>";
                    }
                    str = str + blank + json_value;
                    //console.log(item);
                }
            }
            str += generateBlank(level - 1) + "]</span>";
            return str;
        } else if (typeof obj === "object") {//是一个object类型
            var str = "<span data-type=\"object\">" + "<i style=\"cursor:pointer;\" class=\"fa fa-minus-square-o\" onclick=\"hide(this)\"></i>" + "{<br>";
            var blank = generateBlank(level);

            const keys = Object.keys(obj);
            for (let i = 0; i < keys.length; i++) {
              const key = keys[i];
              const value = obj[key];

              var json_key = "<span class=\"json_key\" contenteditable=\"true\">\"" + key + "\"</span>" + ": ";
              var json_value = stringifyToHtml(value, level + 1);
              if (i === keys.length - 1) {
                json_value += "";
              } else {
                json_value += ",<br>";
              }
              str = str + blank + json_key + json_value;
            }
             str += "<br>" + generateBlank(level - 1) + "}</span>";
             return str;
        } else if (typeof obj === "number") {
            return "<span class=\"json_number\" contenteditable=\"true\">" + obj + "</span>";
        } else if (typeof obj === "boolean") {
            return "<span class=\"json_boolean\" contenteditable=\"true\">" + obj + "</span>";
        } else if (typeof obj === "string") {
            return "<span class=\"json_string\" contenteditable=\"true\">\"" + obj + "\"</span>";
        } else {
            return "" + obj;
        }
      }

    function hide(obj){
        checkDomain();
        var data_type = obj.parentNode.getAttribute('data-type');
        var data_size = obj.parentNode.getAttribute('data-size');
        $(obj).parent().hide();
        var span = document.createElement('span');
        span.className = 'custom-plus';
        if (data_type === 'array') {
            span.innerHTML = '<i  style="cursor:pointer;" class="fa fa-plus-square-o" onclick="show(this)"></i>Array[<span class="json_number">' + data_size + '</span>]';
            $(obj).parent().before(span);
        }else{
            span.innerHTML = '<i  style="cursor:pointer;" class="fa fa-plus-square-o" onclick="show(this)"></i>Object{...}';
            $(obj).parent().before(span);
        }
    }

    function show(obj){
        checkDomain();
        $(obj).parent().next().show();
        $(obj).parent().remove();
    }

    function zip() {
        checkDomain();
        if (zip_flag) {
            $('#json-src').keyup();
        } else {
            $('#json-target').html("<xmp>" + current_json_str + "</xmp>");
            zip_flag = true;
            $(this).attr('style', 'color:#15b374;');
        }
    }

    $('.zip').click(function () {
        zip();
        return false;
    });

    function json2xml() {
        checkDomain();
        if (xml_flag) {
            $('#json-src').keyup();
        } else {
            var result = $.json2xml(current_content);
            $('#json-target').html('<textarea style="width:100%;height:80vh;border:0;resize:none;">' + result + '</textarea>');
            xml_flag = true;
            $(this).attr('style', 'color:#15b374;');
        }
    }

    $('.xml').click(function () {
        json2xml();
        return false;
    });

    $('.compress').click(function (event) {
        event.preventDefault();
        checkDomain();
        if (!compress_flag) {
            $(this).attr('style', 'color:#15b374;');
            //$(this).attr('title','取消折叠').tooltip('fixTitle').tooltip('show');
            $($(".fa-minus-square-o").toArray().reverse()).click();
            compress_flag = true;
        } else {
            while ($(".fa-plus-square-o").length > 0) {
                $(".fa-plus-square-o").click();
            }
            compress_flag = false;
            $(this).attr('style', 'color:#555;');
            $(this).attr('title', 'compress').tooltip('fixTitle').tooltip('show');
        }
//        return false;
    });

    $('.clear').click(function () {
        $('#json-src').val('');
        $('#json-target').html('');
        return false;
    });

    $(".copy").on("click", function(event) {
      event.preventDefault();
      // 在这里添加自定义处理逻辑
    });

    var clipboard = new Clipboard('.copy');

    (function ($) {
        $.fn.innerText = function (msg) {
            if (msg) {
                if (document.body.innerText) {
                    for (var i in this) {
                        this[i].innerText = msg;
                    }
                } else {
                    for (var i in this) {
                        this[i].innerHTML.replace(/&amp;lt;br&amp;gt;/gi, "n").replace(/(&amp;lt;([^&amp;gt;]+)&amp;gt;)/gi, "");
                    }
                }
                return this;
            } else {
                if (document.body.innerText) {
                    return this[0].innerText;
                } else {
                    return this[0].innerHTML.replace(/&amp;lt;br&amp;gt;/gi, "n").replace(/(&amp;lt;([^&amp;gt;]+)&amp;gt;)/gi, "");
                }
            }
        };
    })(jQuery);


    $('.save').click(function () {
        var text = $('#json-target').innerText().replace('　　', '    ');
        // console.log(text);
        var blob = new Blob([text], {type: "application/json;charset=utf-8"});
        var timestamp = new Date().getTime();
        saveAs(blob, "format_" + timestamp + ".json");
        return false;
    });

    $('.shown').click(function () {
        if (!shown_flag) {
            renderLine();
            $('#line-num').show();
            console.log($('#line-num'))
            //$('.numberedtextarea-line-numbers').show();
            shown_flag = true;
            $(this).attr('style', 'color:#15b374;');
        } else {
            $('#line-num').hide();
            //$('.numberedtextarea-line-numbers').hide();
            shown_flag = false;
            $(this).attr('style', 'color:#999;');
        }
        return false;
    });

    function renderLine() {
        var line_num = $('#json-target').height() / 20;
        $('#line-num').html("");
        var line_num_html = "";
        for (var i = 1; i < line_num + 1; i++) {
            line_num_html += "<div>" + i + "<div>";
        }
        $('#line-num').html(line_num_html);
    }

