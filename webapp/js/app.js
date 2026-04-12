(function(){"use strict";var CS="https://t.me/xxx";var currentTab="home";var historyStack=[];var carouselInterval=null;var currentSlide=0;var C={food:{title:"🍜 美食推荐",desc:"木姐地道美食",color:"linear-gradient(135deg,#ff6b35,#ff9a56)",tabs:["全部","中餐","缅餐","烧烤","火锅","小吃","饮品"],shops:[
{name:"木姐老街火锅",desc:"正宗川味火锅，麻辣鲜香",tags:["火锅","麻辣"],rating:"4.8",icon:"🍜"},
{name:"缅甸风味餐厅",desc:"地道缅甸菜，椰汁面条",tags:["缅餐","特色"],rating:"4.6",icon:"🍛"},
{name:"东北烧烤城",desc:"正宗东北烧烤",tags:["烧烤","夜宵"],rating:"4.7",icon:"🍖"},
{name:"木姐奶茶铺",desc:"手打奶茶、鲜榨果汁",tags:["饮品","甜品"],rating:"4.5",icon:"🧋"},
{name:"粤式茶餐厅",desc:"港式早茶、叉烧饭",tags:["中餐","粤菜"],rating:"4.4",icon:"🥟"}]},
hotel:{title:"🏨 酒店住宿",desc:"木姐舒适酒店",color:"linear-gradient(135deg,#4facfe,#00f2fe)",tabs:["全部","经济型","舒适型","豪华型","民宿"],shops:[
{name:"木姐国际大酒店",desc:"四星级标准，设施齐全",tags:["豪华","含早"],rating:"4.7",icon:"🏨"},
{name:"金三角宾馆",desc:"经济实惠，干净卫生",tags:["经济","实惠"],rating:"4.3",icon:"🏠"},
{name:"缅甸风情民宿",desc:"体验当地风情",tags:["民宿","特色"],rating:"4.5",icon:"🏡"},
{name:"木姐商务酒店",desc:"商务出行首选",tags:["商务","WiFi"],rating:"4.4",icon:"🏢"}]},
shopping:{title:"🛒 购物指南",desc:"木姐购物好去处",color:"linear-gradient(135deg,#fa709a,#fee140)",tabs:["全部","商场","超市","特产","数码"],shops:[
{name:"木姐商业中心",desc:"木姐最大商场",tags:["商场","综合"],rating:"4.5",icon:"🏬"},
{name:"缅甸特产店",desc:"翡翠、玉石、手工艺品",tags:["特产","玉石"],rating:"4.6",icon:"💎"},
{name:"木姐数码城",desc:"手机、电脑、配件",tags:["数码","手机"],rating:"4.3",icon:"📱"}]},
exchange:{title:"💱 换汇汇率",desc:"实时汇率安全换汇",color:"linear-gradient(135deg,#f5576c,#ff6b81)",tabs:["全部","人民币","美元","泰铢"],shops:[
{name:"诚信换汇中心",desc:"木姐最靠谱换汇",tags:["换汇","安全"],rating:"4.8",icon:"💱"},
{name:"金达换汇",desc:"中缅汇率实时更新",tags:["换汇","优惠"],rating:"4.6",icon:"💰"},
{name:"中缅货币兑换",desc:"多种货币兑换",tags:["换汇","便捷"],rating:"4.5",icon:"🏦"}]},
visa:{title:"📋 签证办理",desc:"专业签证服务",color:"linear-gradient(135deg,#667eea,#764ba2)",tabs:["全部","缅甸签证","中国签证","泰国签证"],shops:[
{name:"木姐签证服务中心",desc:"专业办理各类签证",tags:["签证","专业"],rating:"4.7",icon:"📋"},
{name:"中缅通签证",desc:"缅甸中国签证一站式",tags:["签证","中缅"],rating:"4.5",icon:"✈️"}]},
taxi:{title:"🚕 打车出行",desc:"木姐出行方便快捷",color:"linear-gradient(135deg,#43e97b,#38f9d7)",tabs:["全部","打车","包车","接送"],shops:[
{name:"木姐出行",desc:"木姐城区打车",tags:["打车","便捷"],rating:"4.6",icon:"🚕"},
{name:"中缅包车",desc:"木姐-瑞丽包车接送",tags:["包车","跨境"],rating:"4.7",icon:"🚐"}]},
rental:{title:"🏠 房屋租赁",desc:"木姐租房省心安心",color:"linear-gradient(135deg,#43e97b,#38f9d7)",tabs:["全部","整租","合租","商铺","短租"],shops:[
{name:"木姐安居房产",desc:"木姐本地房源最多",tags:["租房","靠谱"],rating:"4.6",icon:"🏠"},
{name:"华人租房中心",desc:"专为中国同胞提供房源",tags:["租房","华人"],rating:"4.5",icon:"🏢"},
{name:"木姐商铺出租",desc:"旺铺出租位置好",tags:["商铺","旺铺"],rating:"4.3",icon:"🏪"}]},
hospital:{title:"🏥 医疗服务",desc:"木姐就医指南",color:"linear-gradient(135deg,#4facfe,#00f2fe)",tabs:["全部","医院","诊所","药店","牙科"],shops:[
{name:"木姐中心医院",desc:"木姐最大综合医院",tags:["医院","综合"],rating:"4.5",icon:"🏥"},
{name:"华人诊所",desc:"中文沟通常见病治疗",tags:["诊所","中文"],rating:"4.4",icon:"🩺"},
{name:"木姐大药房",desc:"各类药品齐全",tags:["药店","药品"],rating:"4.3",icon:"💊"}]},
entertainment:{title:"🎮 休闲娱乐",desc:"木姐娱乐精彩不停",color:"linear-gradient(135deg,#f093fb,#f5576c)",tabs:["全部","KTV","按摩","网吧","酒吧"],shops:[
{name:"木姐KTV",desc:"木姐最大KTV",tags:["KTV","唱歌"],rating:"4.5",icon:"🎤"},
{name:"泰式按摩中心",desc:"正宗泰式按摩",tags:["按摩","放松"],rating:"4.6",icon:"💆"}]},
beauty:{title:"💅 美容美颜",desc:"木姐美容焕发光彩",color:"linear-gradient(135deg,#fa709a,#fee140)",tabs:["全部","美发","美甲","美容","纹绣"],shops:[
{name:"木姐美发沙龙",desc:"专业美发时尚造型",tags:["美发","造型"],rating:"4.5",icon:"💇"},
{name:"精致美甲美睫",desc:"美甲美睫纹绣一站式",tags:["美甲","美睫"],rating:"4.6",icon:"💅"}]},
tools:{title:"🔧 实用工具",desc:"生活工具方便实用",color:"linear-gradient(135deg,#667eea,#764ba2)",tabs:["全部","翻译","计算","查询"],shops:[
{name:"中缅翻译助手",desc:"中文缅甸语实时翻译",tags:["翻译","语言"],rating:"4.7",icon:"🌐"},
{name:"汇率计算器",desc:"实时汇率换算",tags:["计算","汇率"],rating:"4.5",icon:"🔢"}]},
car:{title:"🚗 车行服务",desc:"买车卖车车辆服务",color:"linear-gradient(135deg,#f093fb,#f5576c)",tabs:["全部","新车","二手车","维修","保险"],shops:[
{name:"木姐车行",desc:"新车二手车买卖",tags:["车行","买卖"],rating:"4.5",icon:"🚗"},
{name:"汽车维修中心",desc:"专业维修保养",tags:["维修","保养"],rating:"4.4",icon:"🔧"}]},
express:{title:"📦 快递物流",desc:"中缅快递安全送达",color:"linear-gradient(135deg,#4facfe,#00f2fe)",tabs:["全部","中缅快递","同城配送","国际物流"],shops:[
{name:"中缅快递",desc:"中国缅甸双向快递",tags:["快递","跨境"],rating:"4.6",icon:"📦"},
{name:"木姐同城闪送",desc:"木姐城区2小时送达",tags:["闪送","同城"],rating:"4.5",icon:"⚡"},
{name:"国际物流中心",desc:"大宗货物物流",tags:["物流","大宗"],rating:"4.4",icon:"🚛"}]}};

function init(){
initCarousel();initRouter();initTelegramWebApp();fetchExchangeRate();}

function initTelegramWebApp(){if(window.Telegram&&window.Telegram.WebApp){var tg=window.Telegram.WebApp;tg.ready();tg.expand();if(tg.initDataUnsafe&&tg.initDataUnsafe.user){var user=tg.initDataUnsafe.user;var nameEl=document.getElementById("profileName");if(nameEl)nameEl.textContent=user.first_name||"用户";}document.body.classList.add("tg-theme");}}

function initCarousel(){var track=document.getElementById("carouselTrack");var dotsContainer=document.getElementById("carouselDots");if(!track||!dotsContainer)return;var slides=track.querySelectorAll(".carousel-slide");dotsContainer.innerHTML="";slides.forEach(function(_,i){var dot=document.createElement("div");dot.className="dot"+(i===0?" active":"");dot.onclick=function(){goToSlide(i);};dotsContainer.appendChild(dot);});startCarousel(slides.length);}

function goToSlide(index){var track=document.getElementById("carouselTrack");if(!track)return;currentSlide=index;track.style.transform="translateX(-"+(index*100)+"%)";updateDots();}

function updateDots(){var dots=document.querySelectorAll(".carousel-dots .dot");dots.forEach(function(dot,i){dot.className="dot"+(i===currentSlide?" active":"");});}

function startCarousel(total){if(carouselInterval)clearInterval(carouselInterval);carouselInterval=setInterval(function(){currentSlide=(currentSlide+1)%total;goToSlide(currentSlide);},3500);}

function initRouter(){handleRoute();window.addEventListener("hashchange",handleRoute);}

function handleRoute(){var hash=window.location.hash.replace("#","")||"";var parts=hash.split("/").filter(Boolean);if(parts.length===0){switchTab("home");}else if(parts[0]==="category"&&parts[1]){showCategoryPage(parts[1]);}else if(parts[0]==="search"){showPage("search");}else{switchTab(parts[0]);}}

function navigateTo(path){historyStack.push(window.location.hash);window.location.hash="#/"+path;}window.navigateTo=navigateTo;

function goBack(){if(historyStack.length>0){window.location.hash=historyStack.pop();}else{window.location.hash="#";}}window.goBack=goBack;

function switchTab(tab){currentTab=tab;historyStack=[];window.location.hash="#";var pages=document.querySelectorAll(".page");pages.forEach(function(p){p.classList.remove("active");});var target=document.getElementById("page-"+tab);if(target)target.classList.add("active");var navItems=document.querySelectorAll(".nav-item");var tabMap={home:0,errand:1,expose:2,activity:3,profile:4};navItems.forEach(function(item,i){item.classList.toggle("active",i===tabMap[tab]);});document.getElementById("headerBack").style.display="none";document.getElementById("headerTitle").textContent="木姐同城生活助手";document.getElementById("bottomNav").style.display="flex";if(tab==="home")initCarousel();}window.switchTab=switchTab;

function showPage(page){var pages=document.querySelectorAll(".page");pages.forEach(function(p){p.classList.remove("active");});var target=document.getElementById("page-"+page);if(target)target.classList.add("active");document.getElementById("headerBack").style.display="block";document.getElementById("headerTitle").textContent="搜索";document.getElementById("bottomNav").style.display="none";}

function showCategoryPage(catKey){var cat=C[catKey];if(!cat){switchTab("home");return;}var pages=document.querySelectorAll(".page");pages.forEach(function(p){p.classList.remove("active");});document.getElementById("page-category").classList.add("active");document.getElementById("categoryBanner").style.background=cat.color;document.getElementById("categoryTitle").textContent=cat.title;document.getElementById("categoryDesc").textContent=cat.desc;var tabsEl=document.getElementById("categoryTabs");tabsEl.innerHTML="";cat.tabs.forEach(function(tab,i){var tabEl=document.createElement("div");tabEl.className="tab"+(i===0?" active":"");tabEl.textContent=tab;tabEl.onclick=function(){tabsEl.querySelectorAll(".tab").forEach(function(t){t.classList.remove("active");});tabEl.classList.add("active");};tabsEl.appendChild(tabEl);});var listEl=document.getElementById("shopList");listEl.innerHTML="";cat.shops.forEach(function(shop){listEl.innerHTML+=renderShopCard(shop,catKey);});document.getElementById("headerBack").style.display="block";document.getElementById("headerTitle").textContent=cat.title;document.getElementById("bottomNav").style.display="flex";}

function renderShopCard(shop,catKey){var tagsHtml=shop.tags.map(function(t){return'<span class="tag">'+t+"</span>";}).join("");var avatarBg=C[catKey]?C[catKey].color:"linear-gradient(135deg,#ff6b35,#ff9a56)";return'<div class="shop-card"><div class="shop-card-header"><div class="shop-avatar" style="background:'+avatarBg+'">'+shop.icon+'</div><div class="shop-meta"><h4>'+shop.name+'</h4><p>⭐ '+shop.rating+"</p></div><div class=\"shop-rating\">⭐ "+shop.rating+'</div></div><div class="shop-desc">'+shop.desc+'</div><div class="shop-tags">'+tagsHtml+'</div><button class="shop-contact-btn" onclick="contactService(\''+shop.name+'\')">💬 联系商家</button></div>';}

function contactService(name){window.open(CS,"_blank");}window.contactService=contactService;

function doSearch(keyword){var input=document.getElementById("searchInput");if(input)input.value=keyword;var found=null;Object.keys(C).forEach(function(key){C[key].shops.forEach(function(shop){if(shop.name.indexOf(keyword)!==-1||shop.tags.join(",").indexOf(keyword)!==-1){found=key;}});});if(found)navigateTo("category/"+found);}window.doSearch=doSearch;

function fetchExchangeRate(){var cnyEl=document.getElementById("rateCnyMmk");var usdEl=document.getElementById("rateUsdMmk");fetch("https://api.exchangerate-api.com/v4/latest/CNY").then(function(r){return r.json();}).then(function(data){var mmk=data.rates&&data.rates.MMK;if(mmk&&cnyEl)cnyEl.textContent="1 : "+Math.round(mmk);}).catch(function(){if(cnyEl)cnyEl.textContent="1 : 约580";});fetch("https://api.exchangerate-api.com/v4/latest/USD").then(function(r){return r.json();}).then(function(data){var mmk=data.rates&&data.rates.MMK;if(mmk&&usdEl)usdEl.textContent="1 : "+Math.round(mmk);}).catch(function(){if(usdEl)usdEl.textContent="1 : 约4200";});}

if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}})();
