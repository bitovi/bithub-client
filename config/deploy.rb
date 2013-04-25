require 'capistrano/ext/multistage'
require 'bundler/capistrano'

set(:use_sudo, false)
set(:ssh_options, { :forward_agent => true })
set(:bundle_flags, "--deployment --quiet --binstubs")
set(:scm, :git)
set(:git_enable_submodules, 1)

set(:user, "bithub")
set(:application, "client")
set(:repository, "git@github.com:bitovi/bithub-client.git")

set(:branch, "master")
set(:deploy_via, :remote_cache)
set(:deploy_to) { "/home/#{user}/#{application}" }

set(:default_environment, {
  'PATH' => "/home/#{user}/.rbenv/shims:/home/#{user}/.rbenv/bin:$PATH"
})

set(:stages, ['staging', 'prod'])
set(:default_stage, 'prod')
