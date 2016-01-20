// ==UserScript==
// @name         Spacebattles & Sufficient Velocity DeWormer
// @namespace    http://www.graphnode.com/userscripts/sb-dewormer
// @version      1
// @description  Removes Worm based threads on spacebattles.
// @author       Diogo Gomes <dgomes@graphnode.com>

// @match        https://forums.spacebattles.com/*
// @match        https://forums.sufficientvelocity.com/*

// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var keywords = JSON.parse(localStorage.getItem('deworm-keywords'));

if (keywords === null) {
    keywords = ['worm', 'crack'];
    localStorage.setItem('deworm-keywords', JSON.stringify(keywords));
}

var selector = keywords.map((word) => '.discussionListItem .title a[data-previewurl*="' + word + '"]').join(', ');

var threads = Array.prototype.map.call(document.querySelectorAll(selector), (el) => {
    return el.closest('.discussionListItem');
});

threads.forEach((el) => el.style.display = 'none');

var sectionFooter = document.querySelector('.sectionFooter');

if (sectionFooter !== null) {
    sectionFooter.insertAdjacentHTML('beforeend', 
        '<span class="deworm-info" style="margin-left: 10px">(' + threads.length + ' threads were hidden. Click <a href class="deworm-revert">here</a> to revert.)</span>'
    );
    
    sectionFooter.querySelector('.deworm-revert').addEventListener('click', (e) => {
        e.preventDefault();
        sectionFooter.querySelector('.deworm-info').style.display = 'none';
        threads.forEach((el) => el.style.display = '');
    });
}

var optionsForm = document.querySelector('.DiscussionListOptions');

if (optionsForm != null) {
    optionsForm.querySelector('.buttonGroup').insertAdjacentHTML('beforebegin', '<div class="controlGroup"><label for="ctrl_filter">Filter threads by:</label> <input id="ctrl_filter" type="text" class="textCtrl deworm-input" /></div>');
    
    optionsForm.addEventListener('submit', (e) => {
        keywords = optionsForm.querySelector('#ctrl_filter').value.split(',').map((word) => word.trim());
        localStorage.setItem('deworm-keywords', JSON.stringify(keywords));
    });
    
    document.querySelector('#ctrl_filter').value = keywords.join(', ');
}
