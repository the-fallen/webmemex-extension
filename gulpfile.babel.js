import gulp from 'gulp'
import uglify from 'gulp-uglify'
import identity from 'gulp-identity'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import browserify from 'browserify'
import watchify from 'watchify'
import babelify from 'babelify'
import envify from 'loose-envify/custom'
import uglifyify from 'uglifyify'
import path from 'path'
import cssModulesify from 'css-modulesify'
import cssnext from 'postcss-cssnext'

const files = [
    {
        entries: ['./src/background.js'],
        output: 'background.js',
        destination: './extension',
    },
    {
        entries: ['./src/content_script.js'],
        output: 'content_script.js',
        destination: './extension',
    },
    {
        entries: ['./src/overview/main.jsx'],
        output: 'overview.js',
        destination: './extension/overview',
        cssOutput: 'style.css',
    },
    {
        entries: ['./src/options/main.jsx'],
        output: 'options.js',
        destination: './extension/options',
        cssOutput: 'style.css',
    },
    {
        entries: ['./src/pdf.worker.min.js'],
        output: 'pdf.worker.min.js',
        destination: './extension/pdf-worker',
    },
]

const browserifySettings = {
    debug: true,
    extensions: ['.jsx', '.css'],
    paths: ['.'],
}

function createBundle({entries, output, destination, cssOutput},
                      {watch = false, production = false}) {
    let b = watch
        ? watchify(browserify({...watchify.args, ...browserifySettings, entries}))
            .on('update', bundle)
        : browserify({...browserifySettings, entries})
    b.transform(babelify)
    b.transform(envify({
        NODE_ENV: production ? 'production' : 'development',
    }), {global: true})

    if (cssOutput) {
        b.plugin(cssModulesify, {
            global: true,
            output: path.join(destination, cssOutput),
            postcssBefore: [
                cssnext,
            ],
        })
    }

    if (production) {
        b.transform(uglifyify, {global: true})
    }

    function bundle() {
        let startTime = Date.now()
        b.bundle()
            .on('error', error => console.error(error.message))
            .pipe(source(output))
            .pipe(buffer())
            .pipe(production ? uglify({output: {ascii_only: true}}) : identity())
            .pipe(gulp.dest(destination))
            .on('end', () => {
                let time = (Date.now() - startTime) / 1000
                console.log(`Bundled ${output} in ${time}s.`)
            })
    }

    bundle()
}

gulp.task('build-prod', () => {
    files.forEach(bundle => createBundle(bundle, {watch: false, production: true}))
})

gulp.task('build', () => {
    files.forEach(bundle => createBundle(bundle, {watch: false}))
})

gulp.task('watch', () => {
    files.forEach(bundle => createBundle(bundle, {watch: true}))
})

gulp.task('default', ['watch'])
