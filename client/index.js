let name;
let player;
let height
let weight;
let sizeModifier;
let age;
let appearance;
let statST, statDX, statIQ, statHT;
let statHP, statPer, statWill, statFP;
let advantages, disadvantages, skills;
let inventory, meleeWeapons, rangedWeapons, armor, possessions;

const dq = (element) => { return document.querySelector(element); }

const grabDocElements = () => {
    name = dq('#charName');
    player = dq('#charPlayer');
    height = dq('#charHeight');
    weight = dq('#charWeight');
    sizeModifier = dq('#charSizeModifier');
    age = dq('#charAge');
    appearance = dq('#charAppearance');
    statST = dq('#statST');
    statDX = dq('#statDX');
    statIQ = dq('#statIQ');
    statHT = dq('#statHT');
    statFP = dq('#statFP');
    statHP = dq('#statHP');
    statPer = dq('#statPer');
    statWill = dq('#statWill');
    statFP = dq('#statFP');
    advantages = dq('#advantages');
    disadvantages = dq('#disadvantages');
    skills = dq('#skills');
    inventory = dq('#inventory');
    meleeWeapons = dq('#meleeWeapons');
    rangedWeapons = dq('#rangedWeapons');
    armor = dq('#armor');
    possessions = dq('#possessions');
}

const deleteEmptyElement = (e) => {
    if( e.keyCode !== 8) return; // If not delete key, return
    console.log(e.target.value);
    if( e.target.value.length <= 0 && e.target.parentNode.children.length > 2){
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    }
}

const makeListElement = () => {
    let span = document.createElement('span');
    let input0 = document.createElement('input');
    let input1 = document.createElement('input');
    input0.className = 'alias';
    input1.className = 'pointsValue';
    span.appendChild(input0);
    span.appendChild(input1);
    span.onkeydown = deleteEmptyElement;
    return span;
}

const handleList = (e) => {
    let p, c, last;
    if(e.keyCode === 13){
        console.log(document.activeElement);
    }
    else {
        p = (e.target) ? e.target.parentNode : e;
        last = (p.children.length > 0) ? p.children[p.children.length-2] : null;
        if(p.children.length < 2){
            c = makeListElement();
            p.appendChild(c);
        }
        else if(last.value.length > 0){
            c = makeListElement();
            p.appendChild(c);
        }
    }
}

const getChildrenValues = (parent) => {
    return [];
}

const saveCharacter = () => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/characters/'+name.value);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = (e) => { console.dir(e.target.response);};
    let reqBody = {
        name: name.value,
        player: player.value,
        description: {
            height: height.value,
            weight: weight.value,
            sizeModifier: sizeModifier.value,
            age: age.value,
            appearance: appearance.value
        },
        stats: {
            ST  : statST.value,
            DX  : statDX.value,
            IQ  : statIQ.value,
            HT  : statHT.value,
            HP  : statHP.value,
            Will: statWill.value,
            Per : statPer.value,
            FP  : statFP.value
        },
        advantages   : getChildrenValues(advantages),
        disadvantages: getChildrenValues(disadvantages),
        skills       : getChildrenValues(skills),
        inventory: {
            meleeWeapons : getChildrenValues(meleeWeapons),
            rangedWeapons: getChildrenValues(rangedWeapons),
            armor        : getChildrenValues(armor),
            possessions  : getChildrenValues(possessions)
        }
    };
    xhr.send(JSON.stringify(reqBody));
    console.dir(reqBody);
    return;
}

window.onload = () => {
    grabDocElements();
    document.querySelector('#saveCharacter').onclick = saveCharacter;

    handleList(advantages, 'advantage');
    handleList(disadvantages, 'disadvantage');
    handleList(skills, 'skill');

    advantages.onkeydown = handleList;
    disadvantages.onkeydown = handleList;
    skills.onkeydown = handleList;
}