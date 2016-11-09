var files = [];
var lastModified = 0;
var last = 0;
var manifest = null;

entries.forEach(function(entry) {
    wrench.readdirSyncRecursive(entry.file).forEach(function(name) {
        var file = GLOBAL.path.join(entry.file, name);
        if (GLOBAL.fs.statSync(file).isFile() && (!entry.ignore || !entry.ignore(file) ) ) {
            if (entry.replace)
                name = entry.replace(name);
            files.push({
                file: file,
                path: entry.prefix + name
            });
        }
    });
});

function generateManifest(fz, lastModified, locals) {
    var a = [];
    a.push('CACHE MANIFEST');
    a.push('# ' + lastModified);
    a.push('');
    a.push('CACHE:');
    a.push('/favicon.ico');
    fz.forEach(function(x) {
        a.push(locals.static.cdn + x.path);
    });
    a.push('');
    a.push('NETWORK:');
    a.push('*');
    a.push('');
    a.push('FALLBACK:');
    a.push('/fail');
    return a.join('\n');
}

module.exports = function (req, res) {
    res.setHeader('content-type', 'text/cache-manifest');
    GLOBAL.async.each(files, function (x, cb) {
        GLOBAL.fs.stat(x.file, function (err, stats) {
            if (err) return cb(err);
            if (stats.mtime > lastModified)
                last = stats.mtime;
            cb();
        });
    }, function (err){
        if (err)
            return next(err);
        if (last > lastModified || _.isNull(manifest) ) {
            manifest = generateManifest(files, last, res.locals);
            lastModified = last;
        }
        res.setHeader('content-length', Buffer.byteLength(manifest));
        res.status(200).send( manifest );
    });
};
