const tmdbKey = "84df723bbc5b72154016efb7f91e2d66";


const array = ['#one!', '#two!', '#three!', '#four!', '#five!', '#six!', '#seve!', '#eight!', '#nine!', '#ten!', '#eleven!', '#twelve', '#thirteen!', '#fourteen!', '#fifteen!', '#sixteen!', '#seventeen!', '#eighteen!', '#ninteeen!', '#twenty!']
const trendingMovies = function(){
  
    $.ajax({
        url: `https://api.themoviedb.org/3/trending/movie/day?api_key=${tmdbKey}`,
        method: 'GET'
    }).then(function(response){
        renderTrending(response);
    })
}

const trendingGames = function(){
    // client.scrollAll('/games/?fields=name,popularity&order=popularity:desc').then(function(response){
    //     console.log(response);
    // });
//     $.get("https://api-endpoint.igdb.com/genres/12,9,11?fields=*", {
//     headers: {
//       "user-key": "5c81cc373f3f55c198577ec9cdcd18ac",
//       Accept: "application/json"
//     }
//   })
//   .then(function(response) {
//     // Do work here
//     console.log(response.data);
//   })
//   .catch(function(err){
//     console.log("error", err);
//   });
};

const renderTrending = function(data){
    for (let i = 0; i< 2; i++){
        $('#moviesList').append(`<a class="carousel-item" href="${array[i]}"><img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2/${data.results[i].poster_path}"></a>`);
    }
    console.log('test');
    $('.carousel').carousel(); 

}
$(document).ready(function(){
    trendingMovies();
    trendingGames();
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

