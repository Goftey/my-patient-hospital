 
 let nextBtn = document.querySelector('.next')
 let prevBtn = document.querySelector('.prev')
 
 let slider = document.querySelector('.slider')
 let sliderList = slider.querySelector('.slider .list')
 let thumbnail = document.querySelector('.slider .thumbnail')
 let thumbnailItems = thumbnail.querySelectorAll('.item')
 
 thumbnail.appendChild(thumbnailItems[0])
 
 // Function for next button 
 nextBtn.onclick = function(event) {
    event.preventDefault();
     moveSlider('next')
 }
 
 
 // Function for prev button 
 prevBtn.onclick = function(event) {
    event.preventDefault();
     moveSlider('prev')
 }
 
 
 function moveSlider(direction) {
     let sliderItems = sliderList.querySelectorAll('.item')
     let thumbnailItems = document.querySelectorAll('.thumbnail .item')
     
     if(direction === 'next'){
         sliderList.appendChild(sliderItems[0])
         thumbnail.appendChild(thumbnailItems[0])
         slider.classList.add('next')
     } else {
         sliderList.prepend(sliderItems[sliderItems.length - 1])
         thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1])
         slider.classList.add('prev')
     }
 
 
     slider.addEventListener('animationend', function(event) {
        event.preventDefault();
         if(direction === 'next'){
             slider.classList.remove('next')
         } else {
             slider.classList.remove('prev')
         }
     }, {once: true}) // Remove the event listener after it's triggered once 
    }

   
 













// document.addEventListener("DOMContentLoaded", function() {
//   let currentIndex = 0;
//   const slides = document.querySelectorAll('.slide');
//   const dots = document.querySelectorAll('.dot');
//   const totalSlides = slides.length;

//   function showSlide(index) {
//     if (index < 0) {
//       currentIndex = totalSlides - 1; 
//     } else if (index >= totalSlides) {
//       currentIndex = 0;
//     } else {
//       currentIndex = index;
//     }

//     slides.forEach((slide, index) => {
//       if (index === currentIndex) {
//         slide.style.display = 'block';
//         slide.style.opacity = 1;
//       } else {
//         slide.style.display = 'none';
//         slide.style.opacity = 0;
//       }
//     });

//     dots.forEach((dot, index) => {
//       dot.classList.toggle('active-dot', index === currentIndex);
//     });
//   }

//   function nextSlide() {
//     const nextIndex = currentIndex + 1 >= totalSlides ? 0 : currentIndex + 1;
//     fadeOutSlide (currentIndex);
//     setTimeout(() => {
//       showSlide(nextIndex);
//       fadeInSlide(nextIndex);
//     }, 2000); // Wait for the fade out animation to complete
//   }

//   function fadeOutSlide(index) {
//     slides[index].style.transition = 'opacity 2s ease-in-out';
//     slides[index].style.opacity = 0;
//   }

//   function fadeInSlide(index) {
//     slides[index].style.transition = 'opacity 5s ease-in-out';
//     slides[index].style.opacity = 1;
//   }

//   function currentSlide(index) {
//     fadeOutSlide(currentIndex);
//     setTimeout(() => {
//       showSlide(index);
//       fadeInSlide(index);
//     }, 2000); // Wait for the fade out animation to complete
//   }

//   dots.forEach((dot, index) => {
//     dot.addEventListener('click', () => currentSlide(index));
//   });

//   // Initial display
//   showSlide(currentIndex);

//   // Change slide every 3 seconds (3000 milliseconds)
//   setInterval(nextSlide, 10000); // Adjusted timing to 5 seconds
//   document.querySelector('.gtr').addEventListener('click', nextSlide);
// });










  