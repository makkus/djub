# Show available tasks.
default:
    @just --list

# Install the locked dependencies (Node 24+).
setup:
    npm ci

# Start the local website with live reload.
dev:
    npm run dev

# Create an event: just new september-meetup "September meetup"
new slug title:
    npm run new -- {{quote(slug)}} {{quote(title)}}

# Build the static site; optionally pass a URL prefix: just build /djub/
build prefix="/":
    PATH_PREFIX={{quote(prefix)}} npm run build

# Build and check the output, including links beneath a URL prefix.
check prefix="/":
    PATH_PREFIX={{quote(prefix)}} npm run check

# Delete the generated site.
clean:
    npm run clean
