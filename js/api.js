
document.getElementById('btn').addEventListener('click', async function(){

    if (document.getElementById('message').textContent === ''){
        const res = await fetch('/api/message')
        const data = await res.json()
        if (!res.ok){
            console.log('Error found')
            console.log(data.message)
        }
    
        document.getElementById('message').textContent = data.message
    } else {
        document.getElementById('message').textContent = ''
    }


})