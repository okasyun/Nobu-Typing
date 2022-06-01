fs.writeFileSync('./text.tet', box, (err, box) => {
    if(err) {
        console.log(err);
    }
});