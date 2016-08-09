// ==UserScript==
// @name         Pikabu User Info
// @namespace    pikabu
// @version      0.6
// @description  Показывает информер с профилем пользователя при наведении мыши на ник 
// @author       FraidZZ
// @include      *
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function ( ) {
	if (!/(https?:\/\/)?(www.)?pikabu\.ru\//i.test(location.href)) return;
	var getProfileDOM = (function (){
		var cache = {};
		return (function (profile) {
			var link = '/profile/' + profile;
			
			return new Promise(function (resolve, reject) {
				if (cache[link] !== undefined) { 
					resolve((new DOMParser()).parseFromString(cache[link], 'text/html'));
					return;
				}
				
				var XHR = new XMLHttpRequest();
				XHR.open('GET', link, true);
				XHR.onreadystatechange = function ( ) {
					if (XHR.readyState != 4 || XHR.status != 200) return;
					
					cache[link] = XHR.responseText;
					var parser = new DOMParser();
					resolve(parser.parseFromString(XHR.responseText, 'text/html'));
				};
				XHR.send(null);
			});
		});
	})();

	function profileHasNote(profile) {
		return new Promise(function (resolve, reject) {
			getProfileDOM(profile).
				then(function (profileDocument) {
					resolve(profileDocument.querySelector('#usr-note-text') && profileDocument.querySelector('#usr-note-text').value !== '');
				});
		});
	}

	function profileGetNode(profile) {
		return new Promise(function (resolve, reject) {
			getProfileDOM(profile).
				then(function (profileDocument) {
					var note = profileDocument.querySelector('#usr-note-text') ? profileDocument.querySelector('#usr-note-text').value : '';
					var profileTableCell = profileDocument.querySelector('.profile_wrap').parentElement;
					function remove(i) {
						i.parentElement.removeChild(i);
					}
					
					remove(profileTableCell.parentElement.children[0]);
					profileTableCell.style.width = '100%';
					[].slice.call(profileTableCell.children).filter(function (i, ind) { return ind > 0; }).forEach(remove);
					remove(profileDocument.querySelector('.profile_wrap > table tr td:nth-child(3)'));
					profileTableCell.parentElement.parentElement.parentElement.style.width = 'inherit';
					profileTableCell.parentElement.parentElement.parentElement.style.maxWidth = '500px';
					profileTableCell.parentElement.parentElement.parentElement.style.padding = '0px';
					profileDocument.querySelector('.profile_wrap').style.margin = '0px';
					profileDocument.querySelector('.profile_wrap').style.width = 'inherit';
					[].slice.call(profileTableCell.querySelectorAll('.b-button, .user-profile-tools')).forEach(remove);
					
					if (note !== '') {
						var firstLabel = profileDocument.querySelector('.b-user-profile__label');
						var noteSpan = document.createElement('span');
						noteSpan.setAttribute('class', 'b-user-profile__value');
						
						var noteText = document.createTextNode(note);
						noteSpan.appendChild(noteText);
						firstLabel.parentElement.insertBefore(noteSpan, firstLabel);
						
						var brNode = document.createElement('br');
						firstLabel.parentElement.insertBefore(brNode, firstLabel); 
					}
					
					var infoDiv = document.createElement('div');
					infoDiv.style.position = 'fixed';
					infoDiv.style.zIndex = '10000000';
					infoDiv.style.display = 'none';
					infoDiv.style.border = '1px solid #d0dde5';
					infoDiv.style.borderRadius = '3px';
				  infoDiv.style.paddingRight = '30px';
					infoDiv.appendChild(profileTableCell.parentElement.parentElement.parentElement);
					resolve(infoDiv);
				});
		});
	}

	function addNoteSym (userSpan) {
		var noteSpan = document.createElement   ('a');
		var noteSym  = document.createTextNode('*');
		noteSpan.appendChild(noteSym);
		noteSpan.href = '#';
		noteSpan.style.color = 'red';
		noteSpan.style.margin = '0px 2px 0px 0px';
		
		if (userSpan.tagName.toLowerCase() == 'span') {
			var bCommentUser = userSpan.parentElement.parentElement;
			bCommentUser.insertBefore(noteSpan, bCommentUser.children[1]);
		} else {
			var bTitleLine = userSpan.parentElement;
			noteSpan.style.textDecoration = 'none';
			bTitleLine.insertBefore(noteSpan, bTitleLine.querySelector('.story__date'));
		}
	}

	function checkNickNames( ) {
		var userSpans = [].slice.call(document.querySelectorAll('.b-comment__user > a > span:not(.userscript-rendered), .story__author:not(.userscript-rendered)'));
		userSpans.forEach(function (userSpan) {
            userSpan.setAttribute('class', (userSpan.getAttribute('class') ? userSpan.getAttribute('class') : '') + ' userscript-rendered');
			var infoBox;
			var showInfoBox = function (evt) {
				infoBox.style.display = 'block';
				infoBox.style.left = (evt.clientX + 5) + 'px';
				infoBox.style.top = (evt.clientY + 5) + 'px';
			};
			
			var hideInfoBox = function (evt) {
				infoBox.style.display = 'none';
			};
			
			var nick = userSpan.textContent;
			profileHasNote(nick).
				then(function (hasNote) { if (hasNote) addNoteSym(userSpan); }).
				then(function ( ) {
					profileGetNode(nick).
						then(function (infoTable){
							infoBox = infoTable;
							document.body.appendChild(infoBox);
							userSpan.addEventListener('mouseover', showInfoBox, false);
							userSpan.addEventListener('mouseout', hideInfoBox, false);
						});
				});
		});
	}
    
    setInterval(checkNickNames, 2000);
    checkNickNames();
})();