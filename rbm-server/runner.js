const { spawn } = require('child_process')

function awaitChildProcess(command, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args)

        child.stdout.on('data', (data) => {
            console.log(`stdoout: ${data}`)
        })

        child.on('close', (code) => {
            if(code == 0) {
                resolve()
            } else {
                reject(new Error(`Child process exited with code ${code}`))
            }
        })
        child.on('error', (err) => {
            reject(err)
        })
    })
}


exports.predict = async function (liked, disliked) {
    var args = ['run_model.py', liked, disliked]
    try {
        console.log('Initializing the recommender...')
        await awaitChildProcess('python', args)
        console.log('Completed!')
    } catch(err) {
        console.log('Error occured: ', err)
    }
}

exports.movielist = async function () {
    var args = ['movies.py']
    try {
        console.log('Getting the list of movies...')
        await awaitChildProcess('python', args)
        console.log('Completed!')
    } catch(err) {
        console.log('Error occured: ', err)
    }
}
