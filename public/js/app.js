
const array = ['#one!', '#two!', '#three!', '#four!', '#five!', '#six!', '#seve!', '#eight!', '#nine!', '#ten!', '#eleven!', '#twelve', '#thirteen!', '#fourteen!', '#fifteen!', '#sixteen!', '#seventeen!', '#eighteen!', '#ninteeen!', '#twenty!']
/******************************************************************Functions to get and display Movies ********************************************************************************/
/*************** Movie Ajax Calls ***********************/
const trendingMovies = function(){
    $.ajax({
        url: '/api/keys/:tmdb',
        method: 'GET'
    }).then(function(key){
        $.ajax({
            url: `https://api.themoviedb.org/3/trending/movie/day?api_key=${key.key}`,
            method: 'GET'
        }).then(function(response){
            renderTrendingMovies(response);
        })
    });
};

const getComingSoon = function(){
    $.ajax({
        url: '/api/keys/:tmdb',
        method: 'GET'
    }).then(function(key){
        $.ajax({
            url: `https://api.themoviedb.org/3/movie/upcoming?api_key=${key.key}&language=en-US&page=1&region=us`,
            method: 'GET'
        }).then(function(response){
            renderComingSoon(response);
        })
    });
};

const getMovieInfo = function(id){
    $.ajax({
        url: '/api/keys/:tmdb',
        method: 'GET'
    }).then(function(key){
        $.ajax({
            url: `https://api.themoviedb.org/3/movie/${id}?api_key=${key.key}`,
            method: 'GET'
        }).then(function(response){
            renderMoreInfo(response);
        });
    });
};

const getMovieSearch = function(search){
    console.log('test')
    $.ajax({
        url: '/api/keys/:tmdb',
        method: 'GET'
    }).then(function(key){
        $.ajax({
            url: `https://api.themoviedb.org/3/search/movie?api_key=${key.key}&language=en-US&query=${search}&page=1&include_adult=false`,
            method: 'GET'
        }).then(function(response){
            renderSearchResults(response);
        })
    });
};

const addInterestToInventory = function(id, owned){ 
    let user = "";
    let opposite ="";
    if (owned === "Interested") {
        opposite = "Owned";
    } else {
        opposite = "Interested";
    }
    $.ajax({
        url: '/api/keys/:tmdb',
        method: 'GET'
    }).then(function(key){
        $.ajax({
            url: '/login',
            method: 'GET'
        }).then(function(response){
            user = response.id;
            $.ajax({
            url: `https://api.themoviedb.org/3/movie/${id}?api_key=${key.key}`,
            method: 'GET'
            }).then(function(res){
            $.ajax({
                url:`/api/checkInventory/`,
                method: 'GET',
                data: {
                    user: user,
                    mediaID: res.id,
                    owned: owned
                }
            }).then(function(checked){
                if (checked === null){
                    console.log(owned);
                    const newInventory = {
                        type: 'Movie',
                        mediaID: res.id,
                        coverArt: `https://image.tmdb.org/t/p/w300_and_h450_bestv2/${res.poster_path}`,
                        owned: owned,
                        userId: user
                    };
                    addToInventoryDB(newInventory);
                } else if (checked.owned === opposite) {
                    const updateInventory = {
                        UserId: user,
                        mediaID: res.id,
                        owned: owned
                    }
                    $.ajax({
                        url: '/api/updateInventory',
                        method: 'PUT',
                        data: updateInventory
                    }).then(function(updated){
                        if (updated.success = "success"){
                            M.toast({html: 'Entry updated'});
                        }
                    });
                } else {
                    return;
                };
            });
        }); 
        });   
    });
}
/*********************** End of movie ajax calls ***************************************/
/*********************** Render Movie calls ********************************************/
const renderTrendingMovies = function(data){
    for (let i = 0; i< data.results.length; i++){
        $('#moviesList').append(`<a class="carousel-item" href="${array[i]}"><img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2/${data.results[i].poster_path}"><button class="information" id=${data.results[i].id}><i class="material-icons circle info">info</i> </button></a>`);
    }
    $('#moviesList').carousel();
};

const renderComingSoon = function(data){
    $('#modal1Header').empty();
    $('#modalContent').empty();
    $('#modal1Header').append('<h4>Coming Soon:</h4>')
    for (let i=0; i<data.results.length; i++){
        $('#modalContent').append(`<div class="col s4 coverArt"> 
                                        <img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2/${data.results[i].poster_path}" max-width="100%" max-height="100%" class="coverart" >
                                        <button class="informationModal" id="${data.results[i].id}"><i class="material-icons circle infoModal">info</i> </button>
                                    </div>`)
    };
   $('#modal1').modal('open');
};

const renderSearchResults = function(data){
    $('#modalContent').empty();
    $('#modalContent').append(`<div class="row">
                                    <h6>Search Results:</h6>
                                </div>`)
    for (let i=0; i<data.results.length; i++){
        $('#modalContent').append(`<div class="col s4 coverArt"> 
                                        <img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2/${data.results[i].poster_path}" max-width="100%" max-height="100%" class="coverart" >
                                        <button class="informationModal" id="${data.results[i].id}"><i class="material-icons circle infoModal">info</i> </button>
                                    </div>`)
    }
};

const renderMoreInfo = function(data){
    const genre = [];
    for (let i = 0; i < data.genres.length; i++){
        genre.push(data.genres[i].name);
    };
    const genreDisplay = genre.join();
    $('#modal2Header').empty();
    $('#modal2Content').empty();
    $('#modal2Header').append(`<h5>${data.original_title}</h5><hr>`)
    $('#modal2Content').append(`<div class="col s12">
                                    <img class="img" id="overview" src="https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.poster_path}">
                                    <span class="flow-text">${data.overview}</span>
                                </div>
                                <table class="col s12">
                                    <tbody>
                                        <tr>
                                            <td><h6 class="left">Release Date: </h6></td>
                                            <td><h6>${data.release_date}</h6></td>
                                        </tr>
                                        <tr>
                                            <td><h6 class="left">Genres: </h6></td>
                                            <td><h6 class="left">${genreDisplay}</h6></td>
                                        </tr>
                                        <tr>
                                            <td><a href="#!" class="waves-effect waves-light btn-flat interested" id="${data.id}">Interested</a></td>
                                            <td><a href="#!" class="waves-effect waves-light btn-flat owned" id="${data.id}">Owned</a></td>
                                        </tr>
                                    </tbody
                                </table>
                            `);
    $('#modal2').modal('open');
};

/********************************End of render calls ***********************************/
/********************************************************************End of functions to get and display Movies ************************************************************************/

/********************************************************************Funcations to get and display Games *******************************************************************************/
/****************** Video Game Ajax calls ***************************/
const trendingGames = function(){
    $.ajax({
        url: '/api/keys/:igdb',
        method: 'GET'
    }).then(function(key){
        $.ajax({
            url: "https://api-endpoint.igdb.com/games/?fields=name,cover,popularity&order=popularity:desc&limit=20",
            method: 'GET' ,
            headers: {"user-key": key.key, "Accept": "application/json"}
    }).then(function(response) {
        renderTrendingGames(response);
    })
    .catch(function(err){
        console.log("error", err);
    });
    });
};

const getGameSearch = function(search){
    $.ajax({
        url: '/api/keys/:igdb',
        method: 'GET'
    }).then(function(key){
        $.ajax({
            url: `https://api-endpoint.igdb.com/games/?search=${search}&fields=*&filter[version_parent][not_exists]=1`,
            method: 'GET',
            headers: {"user-key": key.key, "Accept": "application/json"}
        }).then(function(response){
        renderGameResults(response);
        });
    });
};

const getGameSoon = function(){
    let date = Date.now();
    $.ajax({
        url: '/api/keys/:igdb',
        method: 'GET'
    }).then(function(key){
        $.ajax({
            url: `https://api-endpoint.igdb.com/release_dates/?fields=*&order=date:asc&filter[date][gt]=${date}&limit=20&expand=game`,
            method: 'GET',
            headers: {"user-key": key.key, "Accept": "application/json"}
        }).then(function(response){
            renderGameSoon(response);
        });
    });
}

const getGameInfo = function(id){
    $.ajax({
        url: '/api/keys/:igdb',
        method: 'GET'
    }).then(function(key){
        $.ajax({
            url: `https://api-endpoint.igdb.com/games/${id}?fields=*`,
            method: 'GET',
            headers: {"user-key": key.key, "Accept": "application/json"}
        }).then(function(response){
            renderGameInfo(response);
        });
    });
};

const addGameInterestToInventory = function(id, owned){ 
    let user = "";
    let opposite ="";
    if (owned === "Interested") {
        opposite = "Owned";
    } else {
        opposite = "Interested";
    }
    $.ajax({
        url: '/api/keys/:igdb',
        method: 'GET'
    }).then(function(key){
        $.ajax({
            url: '/login',
            method: 'GET'
        }).then(function(response){
            user = response.id;
            $.ajax({
                url: `https://api-endpoint.igdb.com/games/${id}?fields=*`,
                method: 'GET',
                headers: {"user-key": key.key, "Accept": "application/json"}
            }).then(function(res){
            $.ajax({
                url:`/api/checkInventory/`,
                method: 'GET',
                data: {
                    user: user,
                    mediaID: res[0].id,
                    owned: owned
                   
                }
            }).then(function(checked){
                if (checked === null){
                    console.log(owned);
                    const newInventory = {
                        type: 'Game',
                        mediaID: res[0].id,
                        coverArt: res[0].cover.cloudinary_id,
                        owned: owned,
                        userId: user
                    };
                    addToInventoryDB(newInventory);
                } else if (checked.owned === opposite) {
                    const updateInventory = {
                        UserId: user,
                        mediaID: res.id,
                        owned: owned
                    }
                    $.ajax({
                        url: '/api/updateInventory',
                        method: 'PUT',
                        data: updateInventory
                    }).then(function(updated){
                        if (updated.success = "success"){
                            M.toast({html: 'Entry updated'});
                        }
                    });
                } else {
                    return;
                };
            });
        }); 
        });   
    });
}
/***************** End of video game ajax calls ***************************/
/***************** Start of Video Game render calls ***************************/
const renderTrendingGames = function(data){
    for (let i = 0; i< data.length; i++){
        if (data[i].cover){
            $('#gamesList').append(`<a class="carousel-item" href="${array[i]}"><img src="https://images.igdb.com/igdb/image/upload/t_cover_small/${data[i].cover.cloudinary_id}.png"><button class="gameInfo" id=${data[i].id}><i class="material-icons circle info">info</i> </button></a>`);
        }
    }
    $('#gamesList').carousel();

};

const renderGameSoon = function(data){
    $('#modal1Header').empty();
    $('#modalContent').empty();
    $('#modal1Header').append('<h4>Coming Soon:</h4>')
    for (let i=0; i<data.length; i++){
        $('#modalContent').append(`<div class="col s12 coverArt"> 
                                        <img src="https://images.igdb.com/igdb/image/upload/t_cover_small/${data[i].game.cover.cloudinary_id}.png" class="responsive-img" class="gamecoverart" >
                                        <button class="gameInfo" id="${data[i].id}"><i class="material-icons circle infoModal">info</i> </button>
                                    </div>`)
    };
    $('#modal1').modal('open');
};

const renderGameResults = function(data){
    $('#modalContent').empty();
    $('#modalContent').append(`<div class="row">
                                    <h6>Search Results:</h6>
                                </div>`)
    for (let i=0; i<data.length; i++){
        $('#modalContent').append(`<div class="col s12 coverArt"> 
                                        <img src="https://images.igdb.com/igdb/image/upload/t_cover_small/${data[i].cover.cloudinary_id}.png" class="responsive-img" class="gamecoverart" >
                                        <button class="gameInfo" id="${data[i].id}"><i class="material-icons circle infoModal">info</i> </button>
                                    </div>`)
        }
       $('#modal1').modal('open');
};

const renderGameInfo = function(data){
    console.log(data);
    $('#modal2Header').empty();
    $('#modal2Content').empty();
    $('#modal2Header').append(`<h5>${data[0].name}</h5><hr>`)
    $('#modal2Content').append(`<div class="col s12">
                                    <img class="img" id="overview" src="https://images.igdb.com/igdb/image/upload/t_cover_small/${data[0].cover.cloudinary_id}.jpg">
                                    <span class="flow-text">${data[0].summary}</span>
                                </div>
                                <table class="col s12">
                                    <tbody>
                                        <tr>
                                            <td><h6 class="left">Release Date: </h6></td>
                                            <td><h6>${data[0].release_dates[0].human}</h6></td>
                                        </tr>
                                        <tr>
                                            <td><a href="#!" class="waves-effect waves-light btn-flat gameinterested" id="${data[0].id}">Interested</a></td>
                                            <td><a href="#!" class="waves-effect waves-light btn-flat gameowned" id="${data[0].id}">Owned</a></td>
                                        </tr>
                                    </tbody
                                </table>
                                </div> `);
    $('#modal2').modal('open');
}
/******************** End of video game render calls **************************/
/***********************************************************************End of functions to get and display games ************************************************************************/
const renderSearchModal = function(){
    $('#modal1Header').empty();
    $('#modalContent').empty();
    $('#modal1Header').append(`<div class="container"><div class="row">
                                    <form class="col s12">
                                    <div class="row">
                                        <div class="input-field col s9">
                                        <input id="movieSearch" type="text" class="validate" placeholder="Search">
                                        </div>
                                        <a class="btn-floating waves-effect waves-light search red darken-1" id="Search"><i class="material-icons">search</i></a>
                                    </div>
                                    </form>
                                    </div></div>`)
    $('#modal1').modal('open');
};

const renderGameSearchModal = function(){
    $('#modal1Header').empty();
    $('#modalContent').empty();
    $('#modal1Header').append(`<div class="container"><div class="row">
                                    <form class="col s12">
                                    <div class="row">
                                        <div class="input-field col s10">
                                        <input id="gameSearch" type="text" class="validate" placeholder="Search">
                                        </div>
                                        <a class="btn-floating waves-effect waves-light search red darken-1" id="gSearch"><i class="material-icons">search</i></a>
                                    </div>
                                    </form>
                                    </div></div>`)
    $('#modal1').modal('open');
};



/******************************************************* Start of user sign-in functions ************************************************/
const submitNewUser = function(newUser){
    $.ajax({
        url: '/api/newUser',
        method: 'POST',
        data: newUser
    }).then(function(response){
        window.location.replace('/')
    })
}

const prepareForm = function(){
    const newUser = {
        name: $('#username').val().trim(),
        email: $('#email').val().trim(),
        password: $('#password').val().trim()
    };
    submitNewUser(newUser);
};

$('#signup').validate({
    onkeyup:false,
    rules: {
        username: {
            required: true,
            minlength: 5,
        },
        email: {
            required: true,
            email:true
        },
        password: {
            required: true,
            minlength: 5
        },
        confirmpassword: {
            required: true,
            minlength: 5,
            equalTo: "#password"
        },//For custom messages
    },
    messages: {
        username:{
            required: "Enter a username",
            minlength: "Enter at least 5 characters",
            unique: "Username already exists"
        },
        email: {
            required: "Enter an e-mail address",
            email: "Enter a valid e-mail address"
        },
        password: {
            required: "Please enter a password",
            minlength: "Password must be at least 5 characters"
        },
        confirmpassword: {
            equalTo: 'Passwords do not match'
        },
    },
    errorElement : 'div',
    errorPlacement: function(error, element) {
        var placement = $(element).data('error');
        if (placement) {
            $(placement).append(error)
        } else {
            error.insertAfter(element);
        }
    },
    submitHandler: function(form) {
        prepareForm();
    }
});
/**********************************************************End of user signin functions ***********************************************************/
/**********************************************************Start of Friend List Functions ********************************************************/
const getFriendList = function(){
    let user = ""
    $.ajax({
        url: '/login',
        method: 'GET'
    }).then(function(userres){
        user = userres.id;
        $.ajax({
            url: `/api/friendList/${user}`,
            method: 'GET'
        }).then(function(response){
            renderFriendList(response);
        });
    });
}

const searchUserList = function(search){
    $.ajax({
        url: `/api/users/${search}`,
        method: 'GET'
    }).then(function(response){
        renderFriends(response);
    }).catch(function(err){
        M.toast({html: "User not found"});
    })
};

const addFriend = function(search){
    let user=""
    $.ajax({
        url: '/login',
        method: 'GET'
    }).then(function(userres){
        user = userres.id;
        $.ajax({
            url: `/api/users/${search}`,
            method: 'GET'
        }).then(function(response){
            const newFriend = {
                username: response.username,
                email: response.email,
                profile_image: response.profile_image,
                userId: user
            }
            $.ajax({
                url:`/api/checkFriends/`,
                method: 'GET',
                data: {
                    user: user,
                    username: newFriend.username,
                }
            }).then(function(checked){
                if(checked.success === "success"){
                    M.toast({html: "User is already a friend"});
                    return;
                } 
                $.ajax({
                    url: '/api/user/addFriend',
                    method: 'POST',
                    data: newFriend
                }).then(function(res){
                    M.toast({html: "Friend Added"});
                });
            });
        });
    });
}

const renderFriendSearch = function(){
    $('#modal1Header').empty();
    $('#modalContent').empty();
    $('#modal1Header').append(`<div class="container"><div class="row">
                                    <form class="col s12">
                                    <div class="row">
                                        <div class="input-field col 12">
                                        <input id="friendSearch" type="text" class="validate" placeholder="Search">
                                        </div>
                                        <a class="btn-floating waves-effect waves-light search red darken-1" id="searchFriends"><i class="material-icons">search</i></a>
                                    </div>
                                    </form>
                                    </div></div>`)
    $('#modal1').modal('open');
}

const renderFriendList = function(data){
    console.log(data);
    $('#modal1Header').empty();
    $('#modalContent').empty();
    $('#modal1Header').append('<div class="container"><h4>Friend List:</h4></div>')
    for (let i=0; i < data.length; i++){
        $('#modalContent').append(`<div class="row">
                                        <div class="col s2"><img src="${data[i].profileImage}" class="responsive-img"></div>
                                        <div class="col s6 center"><h6>${data[i].username}</h6></div>
                                        <div class="col s2"><a class="btn-floating waves-effect waves-light checkFriendInventory" id="${data[i].username}"><i class="material-icons">work</i></a></div>
                                        <div class="col s2"><a class="btn-floating waves-effect waves-light removeFriendConfirm" id="${data[i].username}"><i class="material-icons">remove_circle</i></a></div>
                                    </div>`)
    };
    $('#modal1').modal('open');
};

const renderFriends = function(data){
    $('#modalContent').empty();
    $('#modalContent').append(`<div class="row">
                                    <div class="col s2"><img src="${data.profile_image}" class="responsive-img"></div>
                                    <div class="col s8"><h6>${data.username}</h6></div>
                                    <div class="col s1"><a class="btn-floating waves-effect waves-light addFriend red darken-1" id="${data.username}"><i class="material-icons">add_circle_outline</i></a></div>
                                </div>`)
    
}

const getCurrentUser = function(){
    $.ajax({
        url: '/login',
        method: 'GET'
    }).then(function(response){
        renderProfile(response);
    })   
}

const renderProfile = function(data){
    $('#profile').prepend(`<div class="container"><div class="col s8 center">
                                    <img src="${data.profile_image}" class="responsive-img">
                                </div>
                                <div class="col s12 center">
                                    <h3>${data.username}</h3>
                                </div></div>`);
};

const getInventory = function(user){
    $.ajax({
        url: `/api/inventory/${user}`,
        method: 'GET'
    }).then(function(response){
        renderInventory(response);
    });
};

const renderInventory = function(data){
    $('#modal1Header').empty();
    $('#modalContent').empty();
    $('#modalContent').append(`<div class="row">
                                    <h6>Movies: </h6>
                                </div>`)
    for(let i = 0; i < data.length; i++){
        if (data[i].type === "Movie"){
            $('#modalContent').append(`<div class="col s4 coverArt"> 
                                            <img src="${data[i].coverArt}" max-width="100%" max-height="100%" class="coverart" >
                                            <button class="informationModal" id="${data[i].mediaID}"><i class="material-icons circle infoModal">info</i> </button>
                                        </div>`)
        };
    };
    $('#modalContent').append(`<div class="row"></div>
                                <div class="row">
                                    <h6>Games: </h6>
                                </div>`)
    for(let i = 0; i < data.length; i++){
        if (data[i].type === "Game"){
            $('#modalContent').append(`<div class="col s4 coverArt"> 
                                            <img src="https://images.igdb.com/igdb/image/upload/t_cover_small/${data[i].coverArt}.jpg" max-width="100%" max-height="100%" class="coverart" >
                                            <button class="gameInfo" id="${data[i].mediaID}"><i class="material-icons circle infoModal">info</i> </button>
                                        </div>`);
        };
    };
    $('#modal1').modal('open');
};

const renderOptions = function(){
    $('#modal1Header').empty();
    $('#modalContent').empty();
    $('#modal1Header').append(`<div class="container"><h6>Settings:</h6></div>`)
    $('#modalContent').append(` <a class="waves-effect waves-light btn-large red darken-1" id="UpdateProfileImage"><i class="material-icons left">account_circle</i>Update Profile Picture</a>
                                <a class="waves-effect waves-light btn-large red darken-1" id="signOut"><i class="material-icons left">error_outline</i>Sign Out</a>`)
    $('#modal1').modal('open');
}

const renderInviteRequest = function(){
    $('#modal1Header').empty();
    $('#modalContent').empty();
    let user = ""
    $.ajax({
        url: '/login',
        method: 'GET'
    }).then(function(userres){
        user = userres.id;
        $.ajax({
            url: `/api/friendList/${user}`,
            method: 'GET'
        }).then(function(response){
            for (let i = 0; i < response.length; i ++){
                $('.friendList').append(`<div class="chip">
                                                <img src="${response[i].profileImage}" alt="Contact Person">
                                                ${response[i].username}
                                                <a class="waves-effect waves-light btn-float addInvite" id="${response[i].id}"><i class="material-icons right">add</i></a>
                                            </div>`)
            }
            $('#modal3').modal('open');
        });
    });
}

const addtoInvite = function(search){
    $('#inviteList').empty();
    $('#friendList').empty();
    $.ajax({
        url: `/api/users/${search}`,
        method: 'GET'
    }).then(function(response){
        $('.inviteList').append(`<div class="chip">
                                    <img src="${response.profile_image}" alt="Contact Person">
                                    ${response.username}
                                    <a class="waves-effect waves-light btn-float removeInvite" id="${response.id}"><i class="material-icons right">remove</i></a>
                                 </div>`);
    });
};

const removeFromInvite = function(search){
    $.ajax({
        url: `/api/users/${search}`,
        method: 'GET'
    }).then(function(response){
        $('.friendList').append(`<div class="chip">
                                    <img src="${response.profile_image}" alt="Contact Person">
                                    ${response.username}
                                    <a class="waves-effect waves-light btn-float addInvite" id="${response.id}"><i class="material-icons right">add</i></a>
                                 </div>`);
    });
};

const getInvited = function(){
    const invited = [];
    $('.removeInvite').each(function(){
        console.log($(this).attr('id'));
        invited.push($(this).attr('id'));
    });
    createInviteEntry(invited);
};

const createInviteEntry = function(invited){
    const newEvent = {
        name: $('#event_name').val().trim(),
        date: $('#date').val(),
        invited: invited
    }
    $.ajax({
        url: '/api/newInvite/',
        method: 'POST',
        data: newEvent
    }).then(function(response){
        if (response.success === "success"){
            M.toast({html: 'Invite Created'});
            $('#event_name').val('');
            $('#date').val('');
        }
    });
    
}
/**********************************************************Start of interactive functions *********************************************************/
$(document).ready(function(){
    trendingMovies();
    trendingGames();
    $('.modal').modal();
    $('.collapsible').collapsible();
    $('.datepicker').datepicker();
    getCurrentUser();
});

$('#indentMovie').on('swiperight', function(event){
    event.preventDefault;
    $('#movieList').carousel('next');
})

$('#indentMovie').on('swipeleft', function(event){
    event.preventDefault;
    $('#movieList').carousel('prev');
});

$('#profile').on('swiperight', function(event){
    event.preventDefault;
    
    $('#movie').animate({
        left: "+=100"+"vw",
      }, 'fast', function() {
        // Animation complete.
      });
});

$('#profile').on('swipeleft', function(event){
    event.preventDefault;
    $('#games').animate({
        right: "+=100"+"vw",
    }, 'fast', function() {
        //animation complete.
    });
});

$('#games').on('swiperight', function(event){
    event.preventDefault;
    $('#games').animate({
        right: "-=100"+"vw",
    }, 'fast', function(){
        //animation complete
    });
});

$('#movie').on('swipeleft', function(event){
    event.preventDefault;
    $('#movie').animate({
        left: "-=100"+"vw",
    }, 'fast', function(){
        //Animation complete
    })
})

$('#mComingSoon').on('click', function(event){
    event.preventDefault;
    getComingSoon();
})

$('#modalContent').on('click', '.informationModal', function(event){
    event.preventDefault;
    getMovieInfo($(this).attr('id'));
})

$('#moviesList').on('click', '.information', function(event){
    event.preventDefault;
    getMovieInfo($(this).attr('id'));
})

$('#searchMovies').on('click', function(event){
    event.preventDefault;
    renderSearchModal();
})

$('#searchGames').on('click', function(event){
    event.preventDefault;
    renderGameSearchModal();
})

$('#modalHeader').on('click', '#search', function(event){
    console.log('test')
    event.preventDefault;
    getMovieSearch($('#movieSearch').val().trim());
})

$('#loginSubmit').on('click', function(event){
    event.preventDefault;
    const login = {username: $('#username').val().trim(), password: $('#password').val()};
    $.ajax({
        url: '/login',
        method: 'POST',
        data: login
    }).then(function(response){
        if(response.success){
            window.location.replace("/linkster");
        }
    }).catch(function(err){
        M.toast({html: "Invalid Username/Password"});
    })
})

$('#modal2Content').on('click', '.interested', function(event){
    event.preventDefault;
    addInterestToInventory($(this).attr('id'), "Interested");
});

$('#modal2Content').on('click', '.owned', function(event){
    event.preventDefault;
    addInterestToInventory($(this).attr('id'), "Owned");
});

$('#modal2Content').on('click', '.gameowned', function(event){
    event.preventDefault;
    addGameInterestToInventory($(this).attr('id'), "Owned")
});

$('#modal2Content').on('click', '.gameinterested', function(event){
    event.preventDefault;
    addGameInterestToInventory($(this).attr('id'), "Interested");
});

const addToInventoryDB = function(newInventory){
    $.ajax({
        url: '/inventory/addNew',
        method: 'POST',
        data: newInventory
    }).then(function(response){
        if (response.success === true){
            M.toast({html: 'Added to Inventory'});
        }
    })
};

$('#modal1Header').on('click', '#Search', function(event){
    event.preventDefault;
    getMovieSearch($('#movieSearch').val().trim());
});

$('#modal1Header').on('click', '#gSearch', function(event){
    event.preventDefault;
    getGameSearch($('#gameSearch').val().trim());
});

$('#gComingSoon').on('click', function(event){
    event.preventDefault;
    getGameSoon();
});

$('.addFriends').on('click', function(event){
    event.preventDefault;
    renderFriendSearch();
});

$('#friendList').on('click', function(event){
    event.preventDefault;
    getFriendList();
});

$('#modal1Header').on('click', '#searchFriends', function(event){
    event.preventDefault;
    searchUserList($('#friendSearch').val().trim());
});

$('#modalContent').on('click', '.addFriend', function(event){
    event.preventDefault;
    addFriend($(this).attr('id'));
});

$('#inventory').on('click', function(event){
    event.preventDefault;
    $.ajax({
        url: '/login',
        method: 'GET'
    }).then(function(response){
        getInventory(response.id);
    }); 
});

$('#modalContent').on('click', '.checkFriendInventory', function(event){
    event.preventDefault;
    $.ajax({
        url: `/api/users/${$(this).attr('id')}`,
        method: 'GET'
    }).then(function(response){
        getInventory(response.id);
    });
});

$('#modalContent').on('click', '.gameInfo', function(event){
    event.preventDefault;
    getGameInfo($(this).attr('id'));
});

$('#gamesList').on('click', '.gameInfo', function(event){
    event.preventDefault;
    getGameInfo($(this).attr('id'));
});

$('.options').on('click', function(event){
    event.preventDefault;
    renderOptions();
});

$('#modalContent').on('click', '#signOut', function(event){
    event.preventDefault;
    window.location.replace("/");
})

$('.createInvitation').on('click', function(event){
    event.preventDefault;
    renderInviteRequest();
})

$('.friendList').on('click', '.addInvite', function(event){
    event.preventDefault;
    $(this).closest("div.chip").remove();
    addtoInvite($(this).attr('id'));
});

$('.inviteList').on('click', '.removeInvite', function(event){
    event.preventDefault;
    $(this).closest('div.chip').remove();
    removeFromInvite($(this).attr('id'));
});

$('.createInvite').on('click', function(event){
    event.preventDefault;
    getInvited();
})