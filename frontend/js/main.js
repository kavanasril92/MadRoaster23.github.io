$('#load').on('click', () => {
  $.get('http://localhost:8000/api/health')
    .done(res => console.log(res))
    .fail(() => alert('Backend not reachable'));
});