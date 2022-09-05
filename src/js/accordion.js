if (document.querySelectorAll('.accordion').length > 0) {
  var acc = document.getElementsByClassName('accordion__btn')
  var i
  for (i = 0; i < acc.length; i++) {
    acc[i].onclick = function() {
      this.classList.toggle('active')
      var expanded = this.classList.contains('active')
      var hidden = !expanded
      this.setAttribute('aria-expanded', expanded)
      this.nextElementSibling.classList.toggle('show')
      this.nextElementSibling.setAttribute('aria-hidden', hidden)
      var panel = this.nextElementSibling
      if (panel.style.maxHeight){
        panel.style.maxHeight = null
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px'
      }
    }
  }
}
