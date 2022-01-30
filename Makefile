.PHONY: all
all: help


set_comment_cost: 
	@near call ${CONTRACT_ID} set_comment_cost '{ "new_cost": "10000000000000000000000" }' --accountId whilesj.testnet

clear_state: 
	@near call ${CONTRACT_ID} clear_state --accountId whilesj.testnet

add_comment: 
	@near call ${CONTRACT_ID} add_comment '{ "post_id": "my-new-post", "content": "nice blog post!" }' --accountId whilesj.testnet --deposit 0.01

create_post: 
	@near call ${CONTRACT_ID} create_post '{ "post_id": "my-new-post" }' --accountId whilesj.testnet 

get_comments: 
	@near view ${CONTRACT_ID} get_comments '{ "post_id": "my-new-post" }'

## make dev-deploy
dev-deploy:
	@near dev-deploy --wasmFile target/wasm32-unknown-unknown/release/rust_cryptic_comment.wasm --accountId whilesj.testnet

## make deploy: deploy the thing
deploy:
	@near deploy --wasmFile target/wasm32-unknown-unknown/release/rust_cryptic_comment.wasm --accountId whilesj.testnet

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
