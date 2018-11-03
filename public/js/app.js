const tmdbKey = "84df723bbc5b72154016efb7f91e2d66";


const array = ['#one!', '#two!', '#three!', '#four!', '#five!', '#six!', '#seve!', '#eight!', '#nine!', '#ten!', '#eleven!', '#twelve', '#thirteen!', '#fourteen!', '#fifteen!', '#sixteen!', '#seventeen!', '#eighteen!', '#ninteeen!', '#twenty!']
/******************************************************************Functions to get and display Movies ********************************************************************************/
/*************** Movie Ajax Calls ***********************/
const trendingMovies = function(){
    $.ajax({
        url: `https://api.themoviedb.org/3/trending/movie/day?api_key=${tmdbKey}`,
        method: 'GET'
    }).then(function(response){
        renderTrendingMovies(response);
    })
};

const getComingSoon = function(){
    $.ajax({
        url: `https://api.themoviedb.org/3/movie/upcoming?api_key=84df723bbc5b72154016efb7f91e2d66&language=en-US&page=1&region=us`,
        method: 'GET'
    }).then(function(response){
        renderComingSoon(response);
    })
};

const getMovieInfo = function(id){
    console.log(id);
    $.ajax({
        url: `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbKey}`,
        method: 'GET'
    }).then(function(response){
        renderMoreInfo(response);
    });
};

const getMovieSearch = function(search){
    $.ajax({
        url: `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&language=en-US&query=${search}&page=1&include_adult=false`,
        method: 'GET'
    }).then(function(response){
        
    })
};
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
    }
   $('#modal1').modal('open');
};

const renderMoreInfo = function(data){
    console.log(data);
    $('#modal2Header').empty();
    $('#modal2Content').empty();
    $('#modal2Header').append(`<h5>${data.original_title}</h5><hr>`)
    $('#modal2Content').append(`<div class="col s12">
                                    <img class="img" id="overview" src="https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.poster_path}">
                                    <span class="flow-text">${data.overview}</span>
                                </div>
                                <div class="col s12">
                                    <h6 class="left">Release Date:</h6> ${data.release_date}
                                </div>
                                <div class="col s12">
                                    <h6 class="left">Genres:</h6>`);
    for (let i=0; i < data.genres.length; i++){
        $('#modal2Content').append(`${data.genres[i].name},`);
    }
    $('#modal2Content').append('</div>')

    $('#modal2').modal('open');
};

/********************************End of render calls ***********************************/
/********************************************************************End of functions to get and display Movies ************************************************************************/

/********************************************************************Funcations to get and display Games *******************************************************************************/
/****************** Video Game Ajax calls ***************************/
const trendingGames = function(){
    $.ajax({
        url: "https://api-endpoint.igdb.com/games/?fields=name,cover,popularity&order=popularity:desc&limit=20",
        method: 'GET' ,
        headers: {"user-key": "65ec884781b32d0dc590af290f28723b", "Accept": "application/json"}
  }).then(function(response) {
    renderTrendingGames(response);
  })
  .catch(function(err){
    console.log("error", err);
  });
};
/***************** End of video game ajax calls ***************************/
/***************** Start of Video Game render calls ***************************/
const renderTrendingGames = function(data){
    for (let i = 0; i< data.length; i++){
        if (data[i].cover){
            $('#gamesList').append(`<a class="carousel-item" href="${array[i]}"><img src="https://images.igdb.com/igdb/image/upload/t_cover_small/${data[i].cover.cloudinary_id}.png"><button class="information" id=${data[i].id}><i class="material-icons circle info">info</i> </button></a>`);
        }
    }
    $('#gamesList').carousel();

};
/******************** End of video game render calls **************************/
/***********************************************************************End of functions to get and display games ************************************************************************/
const renderSearchModal = function(){
    $('#modal1Header').empty();
    $('#modalContent').empty();
    $('#modal1Header').append(`<div class="row">
                                    <form class="col s12">
                                    <div class="row">
                                        <div class="input-field col s8">
                                            <i class="material-icons prefix">search</i>
                                        <input id="movieSearch" type="text" class="validate">
                                        <label for="icon_prefix">Search</label>
                                        </div>
                                        
                                    </div>
                                    <a class="waves-effect waves-light btn-small col s4 search" id="search">Search</a>
                                    </form>
                                    </div>`)
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
            minlength: 5//,
            // remote: {
            //     url: `/register/isUsernameAvailable/${$('#username').val().trim()}`,
            //     type: 'get'
            // }
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
            remote: 'Username already exists'
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
/**********************************************************Start of interactive functions *********************************************************/
$(document).ready(function(){
    trendingMovies();
    trendingGames();
    $('.modal').modal();
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

$('#modalHeader').on('click', '#search', function(event){
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
        console.log(response);
    })
})




