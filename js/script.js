 
     
     console.log("Funcionou!");
     
     document.querySelectorAll(".carrossel-container").forEach(container=>{

    new Swiper(container.querySelector(".swiper"),{

        slidesPerView:3,
        spaceBetween:20,
        loop: true,

        navigation:{
            nextEl:container.querySelector(".btn-next"),
            prevEl:container.querySelector(".btn-prev")
        },


        breakpoints:{
        320:{
            slidesPerView:1,
        },
        768:{
            slidesPerView:2,
        },
        1024:{
            slidesPerView:3,
        }
    }


    });

});
