var battle = new RPG.Battle();
var actionForm, spellForm, targetForm;
var infoPanel;

function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}


battle.setup({
    heroes: {
        members: [
            RPG.entities.characters.heroTank,
            RPG.entities.characters.heroWizard
        ],
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    },
    monsters: {
        members: [
            RPG.entities.characters.monsterSlime,
            RPG.entities.characters.monsterBat,
            RPG.entities.characters.monsterSkeleton,
            RPG.entities.characters.monsterBat
        ]
    }
});

battle.on('start', function (data) {
    console.log('START', data);
});

battle.on('turn', function (data) {
    console.log('TURN', data);
 //TODO: render the characters
   var idList = Object.keys(this._charactersById);
   var charList = document.querySelectorAll('.character-list');
  
   var hList = charList[0];
   var mList = charList[1];

   hList.innerHTML = " ";
   mList.innerHTML = " ";
   var i=0;
  	while(i < idList.length){
  		var aux = this._charactersById[idList[i]];
  		
	
   			if(aux.party === 'heroes'){
         hList.innerHTML += '<li data-chara-id="'+idList[i]+'">'+aux.name+
 	 	'(HP: <strong>'+aux.hp+'</strong>/'+aux.maxHp+
 	 	',MP: <strong>'+aux.mp+'</strong>/'+aux.maxMp+') </li>';
        }
        else{mList.innerHTML += '<li data-chara-id="'+idList[i]+'">'+aux.name+
 	 	'(HP: <strong>'+aux.hp+'</strong>/'+aux.maxHp+
 	 	',MP: <strong>'+aux.mp+'</strong>/'+aux.maxMp+') </li>';

 	 }
 	
   		if(aux.hp<=0)
   			 document.querySelector('[data-chara-id="'+idList[i]+'"]').classList.add('dead');

	i++;
   }
 

    // TODO: highlight current character
    var activeHigh = document.querySelector('[data-chara-id = "' + data.activeCharacterId + '"]');
    activeHigh.classList.add('active');

    // TODO: show battle actions form
    actionForm.style.display = 'block';
    var opciones = battle.options.list();
    var choice = actionForm.querySelector('.choices');
    choice.innerHTML = "";
    for(var n in opciones){
    	choice.innerHTML += '<li><label><input type="radio" name="option" value="' +  opciones[n] +
    	'" required> ' + opciones[n] + '</label></li>';
    }

});

battle.on('info', function (data) {
    console.log('INFO', data);

    var informacion = document.querySelector('#battle-info');
    var log = '';
    var by;
    if(data.action === 'defend'){
    	by = 'defended ' + '<strong> correctly</strong>' + '.';
    	log = 'Now his defense is ' + data.newDefense + '.';
    }
    else if(data.action === 'cast'){
    	by = 'casted ' +data.scrollName + ' on' ;
    	log = '<strong>'+ data.targetId + '</strong> and caused ' + prettifyEffect(data.effect);
    }
    else if(data.action === 'attack'){
    	by = 'attacked';
    	log = '<strong>'+ data.targetId + '</strong> and caused ' + prettifyEffect(data.effect);
    }
    console.log(by);
    (data.success) ? 
    informacion.innerHTML = `<strong> ${data.activeCharacterId}</strong> ${by} ${log}`
:
    informacion.innerHTML= `<strong> ${data.activeCharacterId}</strong> ${by} <strong>${data.targetId}</strong> and failed` ;
    // TODO: display turn info in the #battle-info panel
});

battle.on('end', function (data) {
    console.log('END', data);
    var idList = Object.keys(this._charactersById);
   var charList = document.querySelectorAll('.character-list');
  
   var hList = charList[0];
   var mList = charList[1];

   hList.innerHTML = " ";
   mList.innerHTML = " ";
   var i=0;
  	while(i < idList.length){
  		var aux = this._charactersById[idList[i]];

   		
   			if(aux.party === 'heroes'){
         hList.innerHTML += '<li data-chara-id="'+idList[i]+'">'+aux.name+
 	 	'(HP: <strong>'+aux.hp+'</strong>/'+aux.maxHp+
 	 	',MP: <strong>'+aux.mp+'</strong>/'+aux.maxMp+') </li>';
        }
        else{
        	mList.innerHTML += '<li data-chara-id="'+idList[i]+'">'+aux.name+
 	 	'(HP: <strong>'+aux.hp+'</strong>/'+aux.maxHp+
 	 	',MP: <strong>'+aux.mp+'</strong>/'+aux.maxMp+') </li>';

 	 }
 	 document.querySelector('[data-chara-id="'+idList[i]+'"]').classList.add('dead');
    

	i++;
   }
    // TODO: re-render the parties so the death of the last character gets reflected
    // TODO: display 'end of battle' message, showing who won
     var informacion = document.querySelector('#battle-info');
     //informacion.innerHTML = '<strong>${data.winner}</strong>' +' defeated their enemies.';
	informacion.innerHTML= `<strong> ${data.winner.toUpperCase()}</strong> defeated their enemies` ;

	
    // window.location.reload();
});

window.onload = function () {
    actionForm = document.querySelector('form[name=select-action]');
    targetForm = document.querySelector('form[name=select-target]');
    spellForm = document.querySelector('form[name=select-spell]');
    infoPanel = document.querySelector('#battle-info');
    
    actionForm.addEventListener('submit', function (evt) {
        evt.preventDefault();

        // TODO: select the action chosen by the player
       
        var action = actionForm.elements['option'].value;
  
        battle.options.select(action);
        // TODO: hide this menu
         actionForm.style.display = "none";
        // TODO: go to either select target menu, or to the select spell menu
        var opciones = battle.options.list();
      
        var partycheck;
        if(action === 'attack'){
    		var choice = targetForm.getElementsByClassName('choices');
  			choice[0].innerHTML = "";
        	 for(var n in opciones){
        	
     	partycheck = battle._charactersById[opciones[n]].party;
     	(partycheck === 'heroes')?
    	choice[0].innerHTML += '<li><label class = heroes><input type="radio" name="option" value="' +  opciones[n] +
    	'"> ' + opciones[n] + '</label></li>':
    	choice[0].innerHTML += '<li><label class = monsters><input type="radio" name="option" value="' +  opciones[n] +
    	'"> ' + opciones[n] + '</label></li>';
    }

    targetForm.style.display = 'inline';
}
  	else if (action === 'cast'){
   
    var boton = spellForm.querySelector('button[type=submit');
    var choice = spellForm.getElementsByClassName('choices');
    boton.disabled = opciones.length===0;
    choice[0].innerHTML = "";
    console.log(opciones);
    for(var n in opciones){

    	choice[0].innerHTML += '<li><label><input type="radio" name="option" value="' +  opciones[n] +
    	'" required> ' + opciones[n] + '</label></li>';
    }
        spellForm.style.display = 'inline';
  	}
  	else if(action === 'defend'){
  		actionForm.style.display = 'inline';
  	}
    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
       var by = targetForm.elements['option'].value;
       battle.options.select(by);
        // TODO: hide this menu
        targetForm.style.display = 'none';
       
    });

    targetForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();
        // TODO: hide this form
        targetForm.style.display = 'none';
        // TODO: go to select action menu
        actionForm.style.display = 'block';
         var opciones = battle.options.list();
    	var choice = actionForm.querySelector('.choices');
   	 	choice.innerHTML = "";
    	for(var n in opciones){
    	choice.innerHTML += '<li><label><input type="radio" name="option" value="' +  opciones[n] +
    	'"> ' + opciones[n] + '</label></li>';
    }
    });

    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the spell chosen by the player
        var by = spellForm.elements['option'].value;
        battle.options.select(by);
        // TODO: hide this menu
        spellForm.style.display = 'none';
        // TODO: go to select target menu
      //  spellForm.style.display = 'block';
        var opciones = battle.options.list();
    	var choice = targetForm.getElementsByClassName('choices');
  			choice[0].innerHTML = "";
        	 for(var n in opciones){
     
    	choice[0].innerHTML += '<li><label><input type="radio" name="option" value="' +  opciones[n] +
    	'"> ' + opciones[n] + '</label></li>';
    }
    targetForm.style.display = 'inline';

    });

    spellForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();
        // TODO: hide this form
        spellForm.style.display = 'none';
        // TODO: go to select action menu
        actionForm.style.display = 'block';
        var opciones = battle.options.list();
    	var choice = actionForm.querySelector('.choices');
    	choice.innerHTML = "";
    	for(var n in opciones){
    	choice.innerHTML += '<li><label><input type="radio" name="option" value="' + opciones[n] +
    	'"> ' + opciones[n] + '</label></li>';
    }
    });

    battle.start();
};
