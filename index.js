function startSpaceMarineRecruitment() {
    alert("⚔️ ВЕРБОВКА В КОСМОДЕСАНТ ⚔️\n\nТы хочешь стать космодесантником?");
    
    if (!confirm("Готов пройти испытания?")) {
        alert("Цивильным тут не место!");
        return;
    }

    let score = 0;
    let stage = 1;
    let alive = true;

    while (alive && stage <= 5) {
        switch(stage) {
            case 1:
                alert("ИСПЫТАНИЕ 1: ИМПЕРАТОР ВОПРОШАЕТ");
                const q1 = prompt("Как зовут Императора Человечества?\n(Подсказка: Бог-Император на Золотом Троне)");
                
                if (q1 === null) {
                    alert("Дезертир! Расстрел!");
                    return;
                }
                
                if (q1.toLowerCase().includes('император')) {
                    alert("Сойдёт... (+1 очко)");
                    score++;
                } else {
                    alert("ЕРЕТИК! Штрафной взнос!");
                }
                stage = 2;
                break;

            case 2:
                alert("ИСПЫТАНИЕ 2: БИТВА С ГЕНОКРАДОМ");
                alert("На тебя бежит генокрад! Нужно выбрать оружие:");
                
                const weapon = prompt("Выбери оружие:\n1 - Цепной меч\n2 - Лазган\n3 - Кулак\n\nВведи номер:");
                
                if (weapon === null) {
                    alert("Ты замер и был съеден!");
                    return;
                }

                if (weapon === '1') {
                    alert("Цепной меч завелся не сразу, но ты отбился! (+1 очко)");
                    score++;
                } else if (weapon === '2') {
                    alert("Лазган перегрелся! Ты ранен, но выжил. (0 очков)");
                } else if (weapon === '3') {
                    alert("Кулак против когтей? Ты погиб геройски...");
                    alive = false;
                } else {
                    alert("Ты растерялся и споткнулся. -1 жизнь");
                }
                stage = 3;
                break;

            case 3:
                if (!alive) break;
                
                alert("ИСПЫТАНИЕ 3: ПРОВЕРКА НА ЛОЯЛЬНОСТЬ");
                const answer = confirm("Хаос предлагает тебе силу. Предашь Императора?");
                
                if (answer) {
                    alert("ЕРЕСЬ! Ты стал космодесантником Хаоса!");
                    score = 0;
                } else {
                    alert("Верный выбор! Император гордится тобой! (+2 очка)");
                    score += 2;
                }
                stage = 4;
                break;

            case 4:
                if (!alive) break;
                
                alert("ИСПЫТАНИЕ 4: ЕЩЁ ОДНА ПРОВЕРКА НА ЛОЯЛЬНОСТЬ");
                const nextanswer = confirm("Готов отдать жизнь за Империум?");
                
                if (nextanswer) {
                    alert("Император тебя не забудет! (+2 очка)");
                    score += 2;
                } else {
                    alert("ТРУС! И для чего только ты сюда пришёл...");
                    score = 0;
                }
                stage = 5;
                break;
            case 5:
                alert("ПОСЛЕДНЕЕ ИСПЫТАНИЕ: КСЕНОСЫ");
                const q2 = prompt("СКолько ксеносов нужно, чтобы вкрутить лампочку?");
                
                if (q2 === null) {
                    alert("Расстрел!");
                    return;
                }
                
                if (q2.toLowerCase().includes('ноль') || 
                    q2.toLowerCase().includes('нисколько') ||
                    q2.toLowerCase().includes('ни одного') ||
                    q2.toLowerCase().includes('0') ||
                    q2.toLowerCase().includes('умереть') ||
                    q2.toLowerCase().includes('уничтожить')){
                    alert("Всё верно! Ксенос - твой враг и враг Империума! (+1 очко)");
                    score++;
                } else {
                    alert("ЕРЕТИК! Штрафной взнос!");
                }
                stage = 6;
                break;
        }
    }

    if (score >= 5) {
        alert(`ПОЗДРАВЛЯЮ! Ты принят в орден Кровавых Ангелов!\nТвои очки веры: ${score}`);
    } else if (score > 0) {
        alert(`Ты принят, но будешь пушечным мясом.\nОчки веры: ${score}`);
    } else {
        alert("Ты не прошёл отбор. Лучше иди в Астра Милитарум...");
    }

    if (confirm("Хочешь пройти вербовку заново?")) {
        startSpaceMarineRecruitment();
    }
}