.PHONY: all
all: help


set_comment_cost: 
	@near call ${CONTRACT_ID} set_comment_cost '{ "new_cost": "10000000000000000000000" }' --accountId blorg.testnet

clear_state: 
	@near call ${CONTRACT_ID} clear_state --accountId blorg.testnet

add_comment: 
	@near call ${CONTRACT_ID} add_comment '{ "post_id": "my-new-post", "content": "nice blog post!" }' --accountId blorg.testnet --deposit 0.01


create_post: 
	@near call ${CONTRACT_ID} create_post '{ "post_id": "chans-post", "title": "chan", "content": "likes" }' --accountId ${CONTRACT_ID}

get_comments: 
	@near view ${CONTRACT_ID} get_comments '{ "post_id": "my-new-post" }'

get_post: 
	@near view ${CONTRACT_ID} get_post '{ "post_id": "chans-post" }'

get_posts_listing: 
	@near view ${CONTRACT_ID} get_posts_listing '{}'

## make dev-deploy
dev-deploy:
	@near dev-deploy --wasmFile target/wasm32-unknown-unknown/release/rust_cryptic_comment.wasm --accountId blorg.testnet

## make deploy: deploy the thing
deploy:
	@near deploy --wasmFile target/wasm32-unknown-unknown/release/rust_cryptic_comment.wasm --accountId blorg.testnet

## make login: login into near, needed for deployment
login:
	@near login

## make test: run unit tests
test:
	@cargo test -- --nocapture

## make build: build a version of the package for release to the chain
build:
	@cargo build --target wasm32-unknown-unknown --release

## help: Show help and exit.
help: Makefile
	@echo
	@echo "  Choose a command:"
	@echo
	@sed -n 's/^##//p' $< | column -t -s ':' |  sed -e 's/^/ /'
	@echo
