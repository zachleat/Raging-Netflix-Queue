this.manifest = {
    "name": "Raging Netflix Queue Options",
    "icon": "../icon.png",
    "settings": [
        {
            "tab": "Priority",
            "group": "Queues",
            "name": "queues",
            "type": "radioButtons",
            "label": "Add to:",
            "options": [
                ["instant", "Instant Queue Only."],
                ["dvd", "DVD Queue Only."],
                ["instantfirst", "Only add to DVD Queue if not available on Instant."]
            ]
        }
    ]
};
