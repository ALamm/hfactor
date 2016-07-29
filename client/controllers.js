
angular.module('myApp').controller('indexController', ['$scope', '$rootScope', '$route', '$routeParams', 'AuthService', 'CookieService',
    function($scope, $rootScope, $route, $routeParams, AuthService, CookieService) {

        // initialize the title of the app
        $rootScope.TITLE = "HeartFactor";

        // initialize userid.  Used to persist the userid and username (in case of page refresh) and to get/update user settings
        $rootScope.userid = CookieService.getCookieUserId();

        // initialize username for use throughout the site
        $rootScope.username = CookieService.getCookieUsername();

        // set which login options will be shown on login view
        $rootScope.oauthTwitter = true;
        $rootScope.oauthFacebook = false;
        $rootScope.oauthGoogle = false;
        $rootScope.oauthGithub = true;
        $rootScope.oauthLinkedIn = true;


        $rootScope.count = function (arr) {
            return arr.length;
        }    

        $rootScope.totalLikes = function (res) {
            var totalLikes = 0;
            var likeby = res.map( function (val) {
                if (val.authorID == $rootScope.userid) {
                    totalLikes += val.likeby.length
                }
            })
            $rootScope.likes = totalLikes;
        }

        $rootScope.totalReposts = function (res) {
            var totalReposts = 0;
            var reposts = res.map( function (val) {
                if (val.authorID == $rootScope.userid) {
                    totalReposts += val.repostedby.length
                }
            })
            $rootScope.reposts = totalReposts
        }

        $rootScope.highlight = function (arr) {
            if (arr.length > 0 ) {
                for (var i = 0; i < arr.length; i++) {
                    if(arr[i] === $rootScope.userid) {
                        return true
                    }
                }                        
            }     
        };   

        // check if user is logged in 
        // used to update 'logged' variable for the navbar to show/hide nav elements
        AuthService.getUserStatus()
            .then(function(res) {
                // if a user has logged in then res.data.status = true
                if ( res.data.status ) {
                    // set the username and cookies when an oAuth user logs in. 
                    // Local login (username and cookies) is set within loginController below
                    if (res.data.user.hasOwnProperty("someID") === true) {  //   oAuth user is currently logged in
                        $rootScope.username = res.data.user.name;
                        CookieService.setCookie(res.data.user._id, res.data.user.name)
                    }
                }
                $rootScope.logged = AuthService.isLoggedIn();
            });
            
    }            
]);

angular.module('myApp').controller('selectedController', ['$scope', '$rootScope', '$route', '$routeParams', '$http', 'AuthService', 'CookieService', 'ItemService',
    function($scope, $rootScope, $route, $routeParams, $http, AuthService, CookieService, ItemService) {

        $rootScope.userid = CookieService.getCookieUserId();

        $scope.getSelectedBoard = function() {
            // initial values
            $scope.error = false;
            
            // call getSelectedBoard from service
            ItemService.getSelectedBoard()
                // handle success
                .then(function(res) {
                    $scope.selectedItem = res;   // results will include a recent list of Item in Item collection
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Error getting my Item";
                });
        };
        // call the myItem function:
        $scope.getSelectedBoard();        

        $scope.likeItem = function(item) {

            // initial values
            $scope.error = false;
            if($rootScope.logged) {
                // call likeItem from service
                ItemService.likeItem(item)
                    // handle success
                    .then(function(res) {
                        $scope.getSelectedBoard();    // results will include a selection of items
                    })
                    // handle error
                    .catch(function() {
                        $scope.error = true;
                        $scope.errorMessage = "Error liking Item";
                    });
            }
        };


        $scope.repostItem = function(item) {

            // initial values
            $scope.error = false;
            
            if($rootScope.logged) {
                // call repostItem from service
                ItemService.repostItem(item)
                    // handle success
                    .then(function(res) {
                        $scope.getSelectedBoard();    // results will include a selection of items
                    })
                    // handle error
                    .catch(function() {
                        $scope.error = true;
                        $scope.errorMessage = "Error reposting Item";
                    });
            }
        };

    }            
]);

angular.module('myApp').controller('myItemController', ['$scope', '$rootScope', '$route', '$uibModal', 'AuthService', 'CookieService', 'ItemService',
    function($scope, $rootScope, $route, $uibModal, AuthService, CookieService, ItemService) {

        $rootScope.userid = CookieService.getCookieUserId();

        $scope.getMyBoard = function() {
            // initial values
            $scope.error = false;
            
            // call getMyBoard from service
            ItemService.getMyBoard()
                // handle success
                .then(function(res) {
                    $scope.myItem = res;   // results will include a list of this user's Item in Item collection
                    $rootScope.authorname = $rootScope.username;
                    $rootScope.totalLikes(res);
                    $rootScope.totalReposts(res);
                    $rootScope.totalPins = res.length;
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Error getting Item";
                });
        };
        // call the function:
        $scope.getMyBoard();


        $scope.addItem = function() {
            // initial values
            $scope.error = false;

            // call addItem from service
            ItemService.addItem($scope.ItemForm.title, $scope.ItemForm.imgUrl, $rootScope.username)

                // handle success
                .then(function(res) {
                    $scope.ItemForm = {};
                    $scope.getMyBoard();   // results will include a list of this user's Item in Item collection

                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Error adding Item";
                });
        };

        $scope.removeItem = function(item, authorid) {
            // initial values
            $scope.error = false;

            if (authorid === $rootScope.userid) {
                // call removeItem from service
                ItemService.removeItem(item)

                    // handle success
                    .then(function(res) {
                        $scope.getMyBoard();   // results will include a list of this user's Item in Item collection
                    })
                    // handle error
                    .catch(function() {
                        $scope.error = true;
                        $scope.errorMessage = "Error removing Item";
                    });
            }
            else {
                // call removeItem from service
                ItemService.updateItem(item)

                    // handle success
                    .then(function(res) {
                        $scope.getMyBoard();   // results will include a list of this user's Item in Item collection
                    })
                    // handle error
                    .catch(function() {
                        $scope.error = true;
                        $scope.errorMessage = "Error removing Item";
                    });                
            }
        };

        
    }            
]);


angular.module('myApp').controller('userItemController', ['$scope', '$rootScope', '$route', '$routeParams', '$http', 'AuthService', 'CookieService', 'ItemService',
    function($scope, $rootScope, $route, $routeParams, $http, AuthService, CookieService, ItemService) {

        //      Two ways to get the parameter passed in the url
        //      $routeParams.id
        //      console.log('$routeParams.id', $routeParams.id);
        //      OR
        //      $scope.$route = $route;
        //      console.log('$scope.$route.current.params.id', $scope.$route.current.params.id);

        var authorid = $routeParams.id;

        $rootScope.userid = CookieService.getCookieUserId();

        // GET USER NAME for display in the title of user's board
        $scope.getUserAuthorName = function(authorid) {
            // initial values
            $scope.error = false;
            
            // call getMyBoard from service
            ItemService.getUserAuthorName(authorid)
                // handle success
                .then(function(res) {
                        if(res.hasOwnProperty('username')) {
                            $rootScope.authorname = res.username;
                        }
                        else if (res.hasOwnProperty('name')) {
                            $rootScope.authorname = res.name;
                        }
                        else {
                            console.log('for some strange reason there is no authorname');
                        }
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Error getting authorname";
                });
        };
        $scope.getUserAuthorName(authorid);


        // LIKES and REPOSTS for User
        $scope.totalLikes = function (res) {
            var totalLikes = 0;
            var likeby = res.map( function (val) {
                totalLikes += val.likeby.length
            })
            $rootScope.likes = totalLikes;
        }

        $scope.totalReposts = function (res) {
            var totalReposts = 0;
            var reposts = res.map( function (val) {
                totalReposts += val.repostedby.length
            })
            $rootScope.reposts = totalReposts
        }

        // GET this user's item to display on their board
        $scope.getUserBoard = function(authorid) {
            // initial values
            $scope.error = false;
            
            // call getMyBoard from service
            ItemService.getUserBoard(authorid)
                // handle success
                .then(function(res) {
                    $scope.userItem = res;   // results will include a list of this user's Item in Item collection
                    $scope.totalLikes(res);
                    $scope.totalReposts(res);
                    $rootScope.totalPins = res.length;                
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Error getting Item";
                });
        };
        // call the function: 
        $scope.getUserBoard(authorid);        


        $scope.likeItem = function(item) {

            // initial values
            $scope.error = false;
            if($rootScope.logged) {
                // call likeItem from service
                ItemService.likeItem(item)
                    // handle success
                    .then(function(res) {
                        $scope.getUserBoard(authorid);   // results will include a list of user's Item in Item collection
                    })
                    // handle error
                    .catch(function() {
                        $scope.error = true;
                        $scope.errorMessage = "Error liking Item";
                    });
            }
        };


        $scope.repostItem = function(item) {

            // initial values
            $scope.error = false;
            
            if($rootScope.logged) {
                // call repostItem from service
                ItemService.repostItem(item)
                    // handle success
                    .then(function(res) {
                        $scope.getUserBoard(authorid);   // results will include a list of user's Item in Item collection
                    })
                    // handle error
                    .catch(function() {
                        $scope.error = true;
                        $scope.errorMessage = "Error reposting Item";
                    });
            }
        };


    }            
]);

angular.module('myApp').controller('recentItemController', ['$scope', '$rootScope', '$route', 'AuthService', 'CookieService', 'ItemService', 
    function($scope, $rootScope, $route, AuthService, CookieService, ItemService) {

        $rootScope.userid = CookieService.getCookieUserId();

        $scope.getRecentBoard = function() {
            // initial values
            $scope.error = false;
            
            // call getRecentBoard from service
            ItemService.getRecentBoard()
                // handle success
                .then(function(res) {
                    $scope.recentItem = res;   // results will include a recent list of Item in Item collection
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Error getting my Item";
                });
        };
        // call the myItem function:
        $scope.getRecentBoard();


        $scope.likeItem = function(item) {

            if($rootScope.logged) {
                // initial values
                $scope.error = false;
                
                // call likeItem from service
                ItemService.likeItem(item)
                    // handle success
                    .then(function(res) {
                        $scope.getRecentBoard();   // results will include a recent list of Item in Item collection
                    })
                    // handle error
                    .catch(function() {
                        $scope.error = true;
                        $scope.errorMessage = "Error liking Item";
                    });
            }
        };


        $scope.repostItem = function(item) {

            // initial values
            $scope.error = false;
            
            if($rootScope.logged) {
                // call repostItem from service
                ItemService.repostItem(item)
                    // handle success
                    .then(function(res) {
                        $scope.getRecentBoard();   // results will include a recent list of Item in Item collection
                    })
                    // handle error
                    .catch(function() {
                        $scope.error = true;
                        $scope.errorMessage = "Error reposting Item";
                    });
            }
        };

    }            
]);


angular.module('myApp').controller('loginController', ['$scope', '$rootScope', '$location', '$route', 'AuthService', 'CookieService',
    function($scope, $rootScope, $location, $route, AuthService, CookieService) {

        $scope.login = function() {
            // initial values
            $scope.error = false;
            $scope.disabled = true;

            // call login from service
            AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                // handle success
                .then(function(res) {
                    $location.path('/');
                    $scope.disabled = false;
                    $scope.loginForm = {};
                    $rootScope.logged = true;
                    $rootScope.username = res.username;
                    CookieService.setCookie(res.id, res.username);
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Invalid username and/or password";
                    $scope.disabled = false;
                    $scope.loginForm = {};
                });
        };
    }
]);


angular.module('myApp').controller('logoutController', ['$scope', '$rootScope', '$location', 'AuthService', 'CookieService',
    function($scope, $rootScope, $location, AuthService, CookieService) {

        $scope.logout = function() {

            // call logout from service
            AuthService.logout()
                .then(function() {
                    $rootScope.logged = false;
                    $rootScope.username = '';
                    $rootScope.userid = '';
                    CookieService.setCookie('', '');
                    $location.path('/login');
                });
        };
    }
]);

angular.module('myApp').controller('registerController', ['$scope', '$rootScope', '$location', '$timeout', '$route', 'AuthService', 'CookieService',
    function($scope, $rootScope, $location, $timeout, $route, AuthService, CookieService) {

        $scope.register = function() {

            // initial values
            $scope.error = false;
            $scope.success = false;
            $scope.disabled = true;

            // call register from service
            AuthService.register($scope.registerForm.username, $scope.registerForm.password)
                // handle success
                .then(function(res) {
                    $scope.success = true;
                    $scope.successMessage = "Registration Complete!"
                    $scope.disabled = false;
                    $scope.registerForm = {};
                    $rootScope.logged = true;
                    $rootScope.username = res.username;
                    $rootScope.userid = res.id;
                    CookieService.setCookie(res.id, res.username);
                    $location.path('/');
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Something went wrong!";
                    $scope.disabled = false;
                    $scope.registerForm = {};
                });
        };
    }
]);

angular.module('myApp').controller('settingsController', ['$scope', '$rootScope', '$location', '$route', 'AuthService', 'CookieService',
    function($scope, $rootScope, $location, $route, AuthService, CookieService) {

        $rootScope.userid = CookieService.getCookieUserId();

        $scope.getSettings = function() {
            // initial values
            $scope.error = false;
            $scope.disabled = true;

            // call the getSettings from service
            AuthService.getSettings($rootScope.userid)
            
                //handle success
                .then(function(res) {
                    $location.path('/settings');
                    $scope.disabled = false;
                    $scope.settingsForm = {
                        first: res.data.first,
                        last: res.data.last,
                        city: res.data.city,
                        state: res.data.state
                    };
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Couldn't get the settings";
                    $scope.disabled = false;
                    $scope.settingsForm = {};
                });
        };
        $scope.getSettings();


        $scope.updateSettings = function() {
            // initial values
            $scope.success = false;
            $scope.error = false;
            $scope.disabled = true;

            // call updateSettings from service
            AuthService.updateSettings($rootScope.userid, $scope.settingsForm.first, $scope.settingsForm.last, $scope.settingsForm.city, $scope.settingsForm.state)

                // handle success
                .then(function(res) {
                    $location.path('/settings');
                    $scope.success = true;
                    $scope.successMessage = "Settings Updated!"
                    $scope.disabled = false;
                    $scope.settingsForm = {
                        first: res.data.first,
                        last: res.data.last,
                        city: res.data.city,
                        state: res.data.state
                    };
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Invalid first, last, city or state";
                    $scope.disabled = false;
                    $scope.settingsForm = {};
                });
        };
    }
]);



