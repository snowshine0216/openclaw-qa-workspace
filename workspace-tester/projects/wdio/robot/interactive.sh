#!/bin/bash

# Shown Menu Optons
    echo "Welcome to use WebdriverIO robot!"

# while
while true; do
    echo "1. Migrate page objects from Protractor to WebdriverIO"
    echo "2. Exit"
    echo -n "-> "
    # read user input
    read choice

    # Perform actions based on user selections
    case $choice in
        1)
            echo "Please input the page objects: "
            # the user input may be a string or string with `,`, we need to parse the user input
            read userInput
            # change user input to an array
            IFS=',' read -ra array <<< "$userInput"

            for element in "${array[@]}"; do
                # Try to find the page objects inside e2e/pageObjects folder
                path=$(find ../../e2e/pageObjects -name "$element.js")

                if [[ -z "$path" ]]; then
                    echo "Not found the file, please check your input!"
                else
                    echo "    Now we're handling this page object: $path."
                    node migrate.js $path
                fi
            done
            echo "All page objects have been migrated! You can continue to use WebdriverIO robot!"
            ;;
        2)
            echo "Thanks, bye!"
            break
            ;;
        *)
            echo "Invalid option, please select again"
            ;;
    esac
done