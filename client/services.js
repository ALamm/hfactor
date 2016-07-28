angular.module('myApp').factory('ItemService', ['$q', '$timeout', '$http',
    function($q, $timeout, $http) {

        // return available functions for use in the controllers
        return ({
            getUserBoard: getUserBoard,
            getUserAuthorName: getUserAuthorName,
            getMyBoard: getMyBoard,
            getRecentBoard: getRecentBoard,
            getSelectedBoard: getSelectedBoard,
            addItem: addItem,
            removeItem: removeItem,
            updateItem: updateItem,
            likeItem: likeItem,
            repostItem: repostItem
        });

        function getUserBoard(authorid) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/userBoard', {
                authorid: authorid
            })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }


        function getUserAuthorName(authorid) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/authorname', {
                authorid: authorid
            })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }


        function getMyBoard() {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.get('/myBoard', {})
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }

        function getRecentBoard() {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.get('/recentBoard')
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }

        function getSelectedBoard() {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.get('/selectedBoard')
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }

        function addItem(title, imgUrl, username) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/addItem', {
                    title: title,
                    imgUrl: imgUrl,
                    username: username
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }

        function removeItem(item) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/removeItem', {
                    item: item
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }        

        function updateItem(item) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/updateItem', {
                    item: item
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }  

        function likeItem(item) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/likeItem', {
                    item: item
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }  

        function repostItem(item) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/repostItem', {
                    item: item
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data.docs);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        } 

    }
]);

angular.module('myApp').factory('CookieService', ['$cookies',
    function($cookies) {

        // return available functions for use in the controllers
        return ({
            setCookie: setCookie,            
            getCookieUserId: getCookieUserId,
            getCookieUsername: getCookieUsername
        });

        function setCookie (userid, username) { 
            // Set cookie
            $cookies.put('userid', userid);    //key, value  
            $cookies.put('username', username);      
        }
        function getCookieUserId () {
            // Retrieve cookie
           return $cookies.get('userid');  
        }
        function getCookieUsername () {
            return $cookies.get('username');
        }
    }
]);


angular.module('myApp').factory('AuthService', ['$q', '$timeout', '$http',
    function($q, $timeout, $http) {

        // create user variable
        var user = null;

        // return available functions for use in the controllers
        return ({
            isLoggedIn: isLoggedIn,
            getUserStatus: getUserStatus,
            login: login,
            logout: logout,
            register: register,
            updateSettings: updateSettings,
            getSettings: getSettings
        });

        function isLoggedIn() {
            if (user) {
                return true;
            } else {
                return false;
            }
        }

        function getUserStatus(path) {
            return $http.get('/status')
                // handle success
                .success(function(data) {
                    if (data.status) {
                        user = true;
                        return data.user
                    } else {
                        user = false;
                        // return false;
                    }
                })
                // handle error
                .error(function(data) {
                    user = false;
                });
        }


        function getSettings(id) {
            // create a new instance of deferred  
            var deferred = $q.defer();
            // get the user settings from the server
            $http.post('/getSettings', {
                    id: id
                })
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }

        function updateSettings(id, first, last, city, state) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/updateSettings', {
                    id: id,
                    first: first,
                    last: last,
                    city: city,
                    state: state
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }

        function login(username, password) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/login', {
                    username: username,
                    password: password
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        user = true;
                        deferred.resolve(data);
                    } else {
                        user = false;
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    user = false;
                    deferred.reject();
                });

            // return promise object
            return deferred.promise;
        }

        function logout() {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a get request to the server
            $http.get('/logout')
                // handle success
                .success(function(data) {
                    user = false;
                    deferred.resolve();
                })
                // handle error
                .error(function(data) {
                    user = false;
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;

        }

        function register(username, password) {
            // create a new instance of deferred
            var deferred = $q.defer();
            // send a post request to the server
            $http.post('/register', {
                    username: username,
                    password: password
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve(data);
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            // return promise object
            return deferred.promise;
        }
    }
]);