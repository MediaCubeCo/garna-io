const UTM_MARKER = 'data-garna-utm';

/**
 * Inline capture for every HTML page.
 * Landing utm_* values are held until marketing consent, then written to
 * localStorage (and a matching cookie). Forms read localStorage first.
 */
export function utmPersistenceScript(): string {
	return `(function(){
'use strict';
if(window.__garnaUtmBooted)return;
window.__garnaUtmBooted=true;
var PREFIX='utm_',PENDING_KEY='garna_utm_pending',COOKIE_NAME='garna_privacy_v1',COOKIE_MAX_AGE=${365 * 24 * 60 * 60};
function utmFromSearch(search){var out={},params=new URLSearchParams(search||'');params.forEach(function(value,key){var lower=String(key||'').toLowerCase();if(lower.indexOf(PREFIX)===0&&value)out[lower]=value;});return out;}
function readPending(){try{var raw=sessionStorage.getItem(PENDING_KEY);if(!raw)return{};var parsed=JSON.parse(raw);if(!parsed||typeof parsed!=='object')return{};var out={};Object.keys(parsed).forEach(function(key){if(String(key).toLowerCase().indexOf(PREFIX)===0&&parsed[key])out[String(key).toLowerCase()]=String(parsed[key]);});return out;}catch(e){return{};}}
function writePending(utm){try{var keys=Object.keys(utm);if(!keys.length){sessionStorage.removeItem(PENDING_KEY);return;}sessionStorage.setItem(PENDING_KEY,JSON.stringify(utm));}catch(e){}}
function savedMarketing(){var prefix=COOKIE_NAME+'=',parts=(document.cookie||'').split(';');for(var i=0;i<parts.length;i++){var item=parts[i].trim();if(item.indexOf(prefix)!==0)continue;try{var value=JSON.parse(decodeURIComponent(item.slice(prefix.length)));if(!value||value.version!==1||typeof value.marketing!=='boolean')return null;return value.marketing;}catch(e){return null;}}return null;}
function marketingAllowed(){if(window.garnaPrivacy&&typeof window.garnaPrivacy.hasConsent==='function')return !!window.garnaPrivacy.hasConsent('marketing');return savedMarketing()===true;}
function remember(utm){Object.keys(utm).forEach(function(key){var value=utm[key];if(!value)return;try{localStorage.setItem(key,value);}catch(e){}document.cookie=encodeURIComponent(key)+'='+encodeURIComponent(value)+'; path=/; max-age='+COOKIE_MAX_AGE+'; SameSite=Lax';});}
function capture(){var fromUrl=utmFromSearch(window.location&&window.location.search);var pending=readPending();var merged={};Object.keys(pending).forEach(function(key){merged[key]=pending[key];});Object.keys(fromUrl).forEach(function(key){merged[key]=fromUrl[key];});if(marketingAllowed()){remember(merged);writePending({});return;}if(savedMarketing()===false){writePending({});return;}writePending(merged);}
function onPrivacy(){capture();}
capture();
window.addEventListener('garna:privacy-updated',onPrivacy);
window.addEventListener('garna:page-content-updated',capture);
})();`;
}

export function buildUtmPersistenceSnippet(): string {
	return `<script ${UTM_MARKER}>${utmPersistenceScript()}</script>`;
}

export function injectUtmPersistence(html: string): string {
	if (!html || html.includes(UTM_MARKER)) return html;
	const snippet = buildUtmPersistenceSnippet();
	if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `${snippet}\n</head>`);
	if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${snippet}\n</body>`);
	return `${snippet}\n${html}`;
}
