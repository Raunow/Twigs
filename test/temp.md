[![Docker Logo][docker-image]][docker-docs]

# Everything Docker 


### Contents

  - [Installation](#installation)
    - [Windows](#windows)
  - [Building an Image](#building-an-image)
    - [Dockerfile](#dockerfile)
  - [Running a container](#running-a-container-locally)
  - [Vocabulary](#vocabulary)



## Installation 

#### Windows
1. Head to Docker [downloads][docker-downloads].

2. Download and install the latest version.

3. Start Docker if it's not already running, this may take a minute or two.

4. Sign up *and/or* into the Docker client. If the client isn't showing.

5. Open Docker settings.

    - Find Docker under "hidden icons" in the taskbar.
    - Right-click and choose "settings".

6. Navigate to "Shared Drives" and select a drive for docker to use.

7. Open your favorite Terminal and execute the following.
    ```sh
    $ docker --version
    $ docker info
    $ docker run hello-world
    ```


These commands test: 

1. Whether Docker is installed.
2. That you have selected a shared drive. 
3. The Daemon has access to the internet.
4. The Daemon can run a container.




## Building an Image

In order to run a Container, we need an Image to stamp out a container from.
Therefore we have to build an image we do that using a "Dockerfile" in the project folder.

### Dockerfile

The Arrigo API uses 8 different commands.
- FROM
  > `FROM image:version`
  > Designates which image to use in the current container/stage of building.
  > Several of these in a Dockerfile is referred to as "Multistaging".

- AS

  >`FROM image:version AS tempstage`
  >Used with multistaging for easier access to other stages' files.
  >`FROM tempstage`

- WORKDIR
  >The working directory in the container.
  >This will be the default path when "**.**" (Dot) is used as the <dest path>.
  >The folder is created if it doesn't exist.

- COPY 
  > `COPY [--from]<file path>  <dest path>`
  > Basic use `COPY . . `
  > Used to copy files from the project into the container.
  > The ``--from=filepath` allows access to other containers files under multistaging.

- ADD

  > `ADD <file path> <dest path>`
  > An extended version of <COPY> that allows for copying/renaming in one command.
  > Check this [article][copy-add] on what to use. *TL:DR: Always use <COPY> by default.*

- RUN
  > `RUN <command>`
  > Tells the container to run the specified command.
  > `RUN npm run build`
  > Useful when referencing scripts in a package.json.

- EXPOSE

  > `EXPOSE <port>`
  > Used to designate which ports are open into the container.

- CMD

  >`CMD <command>`
  >Like <RUN>, this command runs the command, but this is executes when you run the container itself, not when building the container, contrary to <RUN>.
  >`CMD npm run start`



### Building the image

This simplest way is by executing:

```sh
$ docker build [--rm] [-t] .
```

> Remember the last "**.** " (dot) as that signifies the path to the Dockerfile. 

This will result in a container with a random name, "latest" as the version, and a few extra containers that was used in building the image. 



`-t <namespace/containername:version>`

Declares <namespace>, <container name>, and <version>. each of which can be left out. 

`-t rssoftware/arrigo:1.0.0`

`--rm` 

Deletes leftover containers when the build process is done.





## Running a container locally

1. Firstly the ID or Name of the image that we stamp a container from has to be known:

    ```sh
    $ docker images [-a]
    ```

    With the output being a table:

    | REPOSITORY | TAG  | IMAGE ID | CREATED | SIZE |
    | :--------- | ---- | -------- | ------- | -------- |
    | rssoftware/arrigo | 1.0.0 | 7ca2f9cb5536 | n <minutes> ago | 191mb |

    `-a`
    Returns all images, "hidden or not".



2. Run the container by executing:

    ```sh
    $ docker run [-p] IMAGE_ID|NAME
    ```

    The run command take either an image id or name.

    In case of ID, you only need to type out enough characters so it's unique from the other image IDs.

    `-p <localport>:<Exposed port>`

    Binds the exposed port to your own allowing to query the container with localhost.



3.  *"Doublecheck"* whether container is running execute:

    ```sh
    $ docker ps [-a]
    ```

    `-a`

    Includes not currently running containers.

4. To stop a container:

    ```sh
    $ docker stop <container_id>
    ```



## Vocabulary

- **Container** A contained environment with everything necessary to run the designated code inside on any platform at any scale.
- **Docker** Known as the company that standardised containerising applications. 
- **Dockerfile** An extension-less file containing build instructions for the docker daemon to follow.
- **Image** A container "frozen in time".
- **Multistaging** A way of building containers more efficiently. 
- **Stamping Containers** Starting a container from an image.


[docker-docs]: <https://docs.docker.com>
[docker-downloads]: <https://www.docker.com/get-started>
[docker-image]: <https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Docker_%28container_engine%29_logo.svg/2000px-Docker_%28container_engine%29_logo.svg.png>
[copy-add]: <https://medium.freecodecamp.org/dockerfile-copy-vs-add-key-differences-and-best-practices-9570c4592e9e>