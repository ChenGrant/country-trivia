function toggle_mobile_menu(){
    if (window.innerWidth<1100){
      var x = document.getElementById("nav_links");
      if (x.style.display == "flex") {
        x.style.display = "none";
      }
      else{
        x.style.display = "flex";
      }
    } 
  }
  
  prev_width = window.innerWidth;
  curr_width = window.innerWidth;
  
  let reportWindowSize = () => {
    curr_width = window.innerWidth
    if (window.innerWidth>1100){
      var x = document.getElementById("nav_links");
      x.style.display = "flex";
    }
    if (curr_width<1100 && prev_width>=1100){
      var x = document.getElementById("nav_links");
      x.style.display = "none";
    }
    prev_width = window.innerWidth
  };
  
  
  window.addEventListener('resize', reportWindowSize);
  
  