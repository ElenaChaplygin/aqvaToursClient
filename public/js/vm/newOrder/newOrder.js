/**
 * Created by Ignat on 8/21/2015.
 */

(function() {
    'use strict';

    angular
        .module('aqvaApp')
        .controller('newOrderController', NewOrderController);

    NewOrderController.$inject = ['$http', '$scope', '$compile'];

    function NewOrderController($http, $scope, $compile) {
        $scope.isNewTour = false;
        $scope.tabs = [
            {heading: 'Общая информация', template: '/js/vm/newOrder/general.html'},
            {heading: 'Варианты туров', template: '/js/vm/newOrder/variants.html'},
            {heading: 'Переписка', template: '/js/vm/newOrder/messages.html'}
        ];
        $scope.offices = [
            {name: 'Солнцево'},
            {name: 'Старое Кукуево Ашан'},
            {name: 'Бица'},
            {name: 'Сокол'}
        ];
        $scope.managers = [
            {id: 1, fio: 'ZayzevSV', zp_procent: 0},
            {id: 2, fio: 'PetrovMM', zp_procent: 0},
            {id: 3, fio: 'KrylovAP', zp_procent: 0},
            {id: 4, fio: 'MurashovAA', zp_procent: 0}
        ];
        $scope.operators = [
            {id: 1, name: 'Coral'},
            {id: 2, name: 'Maral'},
            {id: 1, name: 'Avral'},
            {id: 3, name: 'Aral'}
        ];
        $scope.statuses = ['Предвыбран', 'Ждет звонка', 'В турах', 'Отказ']; //add overdue not for select
        $scope.tours = [];
        var tourIndex = null;



        $scope.changeTask = function(){
            console.log('TASK!', $scope.messageForm.task);
            $scope.selectedTask = $scope.tour.tourMessages.filter(function(tourM){
                console.log('COUNTING SELECTED MESSAGES', tourM.id, $scope.messageForm.task.id);
                return tourM.id == $scope.messageForm.task.id;
            });
            $scope.selectedTaskMessages = $scope.selectedTask[0]? $scope.selectedTask[0]['taskMessages'] : null;
        };
        $scope.addNewTask = function(){
            $scope.messageForm.tasks.push({name: $scope.messageForm.newTask,
                id: ++$scope.messageForm.tasksIndex});
            $scope.messageForm.task = $scope.messageForm.tasks[$scope.messageForm.tasksIndex];
            $scope.messageForm.newTask = null;
            console.log('TASK ADDED!', $scope.messageForm.task);
        };

        $scope.addManagerToMsg = function(manager){
            var managersString = '';
            $scope.toManagers = '';
            if(manager.selectedForMsg){
                $scope.messageForm.managersMessages.push(manager);
            }
            else{
                var index = $scope.messageForm.managersMessages.map(function(el){
                    return el.id
                }).indexOf(manager.id);
                if(index > -1){ $scope.messageForm.managersMessages.splice(index, 1); }
            }
            for(var i = 0; i < $scope.messageForm.managersMessages.length; i++){
                managersString += $scope.messageForm.managersMessages[i]['fio'] + ' ';
            }
            $scope.toManagers = managersString;
        };

        $scope.getAddressee = function(addressee){
            var res = '';
            addressee.forEach(function(e){
                res += e.fio + ' ';
            })
            return res;
        };

        function initMessages(){
            $scope.messageForm = {
                tasks: [],
                tasksIndex: 0,
                taskStatuses: ['Открыто', 'В работе', 'Решено', 'Проблемно'],
                managersMessages: [],
                isTask: true,
                dueDate: null,
                from: $scope.manager,
                status: null,
            };
            $scope.toManagers = null;
            if($scope.messageForm || $scope.messageForm.tasks){
                var index = $scope.messageForm.tasks.filter(function(e){
                    return e.id == 0;
                });
                index.length > 0? null : $scope.messageForm.tasks.push({name: "Новое задание", id: 0});
            }
        };

        function clearMessage(){
            var temp = $scope.messageForm.tasks;
            var tempIndex = $scope.messageForm.tasksIndex;
            $scope.messageForm = {
                tasks: temp,
                tasksIndex: tempIndex,
                taskStatuses: ['Открыто', 'В работе', 'Решено', 'Проблемно'],
                managersMessages: [],
                isTask: true,
                dueDate: null,
                from: $scope.manager,
                status: null,
            };
            $scope.toManagers = null;

            $scope.managers.forEach(function(manager){
                manager.selectedForMsg = null;
            });
        };

        $scope.options = {
            init: function(){
                $scope.touristsIndex = [];
                $scope.touristsIndex.push({name: '', index: 1});
                $scope.tour = {
                    budget: 100000,
                    start: null,
                    finish: null,
                    minNights: 7,
                    maxNights: 14,
                    nextActionDate: '',
                    from: '',
                    nextAction: '',
                    tourists: [],
                    tourVariants: [],
                    selectedOperator: $scope.operators[1],
                    tourMessages: [],
                    creator: $scope.manager,
                    created: new Date()
                };
                $scope.tourVariant = {};
                $scope.getId();
                $scope.date.setStart();
                $scope.date.setFinish();
                $scope.date.setMinDate();
                $scope.date.setMaxDate();
                initMessages();
            },
            setPercent: function(manager){
                console.log('new tours cntrl dividePercent: ', manager, $scope.managers);
                var mngrs = null;
                if((manager.zp_procent == 0 && manager.isSelected) ||
                    (manager.zp_procent != 0  && !manager.isSelected)){
                    mngrs = $scope.managers.filter(
                        function(m){ return m.isSelected == true; });
                    if(mngrs){
                        var length = mngrs.length;
                        var percent = Math.round(100/length);
                        console.log('new tours cntrl dividePercent: ', mngrs, length, percent);
                        for(var i = 0; i < $scope.managers.length; i++){
                            if($scope.managers[i]['isSelected']){
                                $scope.managers[i]['zp_procent'] = percent;
                            }
                            else{
                                $scope.managers[i]['zp_procent'] = 0;
                            }
                        }
                    }

                }

            },
            recalculatePercent: function(manager){
                console.log('new tours cntrl recalculate: ', manager);
                var length = null,
                    percent = null;
                var mngrs = $scope.managers.filter(
                    function(m){ return m.isSelected == true; });
                if(mngrs){
                    if(!manager.isSelected) { length = mngrs.length; }
                    else { length = mngrs.length - 1; }
                    if(length > 0){
                        percent = Math.round((100 - manager.zp_procent)/ length);
                        console.log('new tours reculc:', mngrs, length, percent);
                        for(var i = 0; i < mngrs.length; i++){
                            if(mngrs[i]['id'] != manager.id){
                                mngrs[i]['zp_procent'] = percent;
                            }
                        }
                    }
                }


            },
            openOrder: function(tourId){
                initMessages();
                tourIndex = $scope.tours.map(function(tour){
                    return tour.id;
                }).indexOf(tourId);
                if(tourIndex > -1){
                    $scope.tour = $scope.tours[tourIndex];
                    $scope.messageForm.tasks = $scope.tour.tourMessages;
                    if($scope.tours[tourIndex]['tourists'].length > 0){
                        $scope.touristsIndex.splice(0,1);
                    }
                    for(var i = 0; i < $scope.tours[tourIndex]['tourists'].length; i++){
                        $scope.touristsIndex.push($scope.tours[tourIndex]['tourists'][i])
                    }
                    $scope.touristsIndex.push(
                        {name: '', index: $scope.tours[tourIndex]['tourists'].length});
                    $scope.isEdit = true;
                    console.log('newOrder edit: ', $scope.tour);
                }
                $scope.messageForm.tasks.push({name: "Новое задание", id: 0});
            }
        };

        $scope.managers[1]['zp_procent'] = 100;
        $scope.managers[1]['isSelected'] = true;
        $scope.selectedOffice = $scope.offices[1];
        $scope.generalForm = {};
        var docIncr = 0;
        var buttonIncr = 1;
        $scope.status = $scope.statuses[1];
        $scope.manager = $scope.managers[1];

        $scope.getId = function(){
            console.log('new tours tour id: ', $scope.selectedOffice);
            var docLetter = '';
            switch ($scope.selectedOffice.name){
                case 'Солнцево': docLetter = 'Sol'; break;
                case 'Старое Кукуево Ашан': docLetter = 'SKA'; break;
                case 'Бица': docLetter = 'BZ'; break;
                case 'Сокол': docLetter = 'Skl'; break;
                default: docLetter = 'MAIN'; break;
            }

            var date = new Date();
            var year = 2000 - date.getFullYear();
            var month = 1 + date.getMonth();
            var day = date.getDate();

            var docId = 'P-' + docLetter + year + month + day + docIncr;
            docIncr++;

            $scope.tour.id = docId;
        };

        $scope.date = {
            format: 'dd-MMMM-yyyy',
            setStart: function(){
                var now = new Date();
                var date = now.getDate();
                now.setDate(date + 7);
                $scope.tour.start = now;
            },
            setFinish: function(){
                var now = new Date();
                var date = now.getDate();
                now.setDate(date + 14);
                $scope.tour.finish = now;
            },
            minDate: null,
            maxDate: null,
            setMinDate: function(){
                console.log('new tours set min');
                return new Date();
            },
            setMaxDate: function(){
                var now = new Date();
                var year = now.getFullYear();
                now.setFullYear(year + 1);
                return now;
            },
            dateOptions: {
                formatYear: 'yy',
                startingDay: 1
            },
            startOpened: false,
            finishOpened: false,
            nextActionOpened: false,
            openStart: function($event) {
            $scope.date.startOpened = true;
            },
            openFinish: function($event){
                $scope.date.finishOpened = true;
            },
            openNextAction: function($event){
                $scope.date.nextActionOpened = true;
            }
        };

        $scope.dynamicPopover = {//managers table template
            templateUrl: 'myPopoverTemplate.html',
            templateUrlMessage: 'messageTemplate.html'
        };

        $scope.addButton = function(tourist) {
            console.log('newTour addButton:', tourist);
            var newIndex = tourist.index + 1;
            $scope.touristsIndex.push({name: '', index: newIndex});
            $scope.tour.tourists.push(tourist);
        };

        $scope.delButton = function(index){
            console.log('newTour delButton:', index);
            var delIndex = $scope.touristsIndex.map(function(t){
                return t.index;
            }).indexOf(index);
            console.log('newTour delButton res:', delIndex);
            if(delIndex > -1){ $scope.touristsIndex.splice(delIndex, 1); }
            var delFromTour = $scope.tour.tourists.map(function(t){
                return t.index;
            }).indexOf(index);
            if(delFromTour > -1){ $scope.tour.tourists.splice(delIndex, 1); }
        };

        $scope.saveTour = function(){
            if($scope.isEdit){
                console.log('newTour editing tour:', $scope.tour);
                $scope.tours.splice(tourIndex, 1, $scope.tour);
                tourIndex = null;
                $scope.isEdit = false;
                //$scope.Orders();
                $scope.options.init();
            }
            else{
                console.log('newTour saving tour:', $scope.tour, $scope.selectedOperator);
                $scope.tours.push($scope.tour);
                //$scope.Orders();
                $scope.options.init();
            }
        };

        $scope.addTourVariant = function(){
            $scope.tour.tourVariants.push($scope.tourVariant);
            $scope.tourVariant = {};
        };

        $scope.Orders = function(){
            $scope.isNewTour = false;
            console.log('IN CLOSE NEW ORDER', $scope.isNewTour);
        };

        $scope.newOrder = function(){
            $scope.isNewTour = true;
        };

        $scope.close = function(){
            $scope.Orders();
        };

        $scope.addMessageToTour = function(){
            var task = {
                id: 5000,
                taskMessages: [],
                status: $scope.messageForm.taskStatus
            };
            var message = {
                messageText: $scope.messageForm.messageText,
                addresses: $scope.messageForm.managersMessages,
                creator: $scope.manager,
                dueDate: $scope.messageForm.dueDate,
                status: $scope.messageForm.taskStatus
            };
            var messagesMap = $scope.tour.tourMessages.map(function(e){
                return e.id
            });
            if($scope.messageForm.isTask && $scope.messageForm.task && $scope.messageForm.task.id > 0){
                var index = messagesMap.indexOf($scope.messageForm.task.id);
                if(index > -1){
                    $scope.tour.tourMessages[index]['taskMessages'].push(message);
                }
                else{
                    task.id = $scope.messageForm.task.id;
                    task.name = $scope.messageForm.task.name;
                    task.taskMessages.push(message);
                    $scope.tour.tourMessages.push(task);
                }
            }
            else{
                var index = messagesMap.indexOf(task.id);
                if(index > -1){
                    $scope.tour.tourMessages[index]['taskMessages'].push(message);
                }
                else{
                    task.taskMessages.push(message);
                    $scope.tour.tourMessages.push(task);
                }
            }
            console.log('Task added:',  $scope.tour.tourMessages);
            clearMessage();
        };

        $scope.options.init();

    }
}());