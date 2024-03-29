"use client";

import NextLink from "next/link";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code"
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { GithubIcon } from "@/components/icons";
import {useDisclosure, Card, CardHeader, CardBody, CardFooter, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";
import {Button, Image, Divider} from "@nextui-org/react";

import { FaGithub, FaCode } from 'react-icons/fa';
import { IoDocumentText} from 'react-icons/io5';
import { HiMail } from "react-icons/hi";
import { lazy } from "react";

import { Canvas } from '@react-three/fiber';
import VolumetricShader from "@/components/shaderscene";
import { Html, Stats } from '@react-three/drei';

const ContactMeHref = lazy(() => import("@/components/contactme"));

export default function Home() 
{
	const {isOpen, onOpen, onOpenChange} = useDisclosure();

	const handleButtonClick = (url : string) => 
	{
		window.location.href = url;
	};

	let email = isOpen ? 
	(
		<ContactMeHref />
	) : null;

	return (
	<>
		<div className="flex items-center justify-center h-screen">
		<Canvas
			style={{ width: '100%', height: '100%' }}
			camera={{ position: [0, 0, 1], fov: 90 }}
			gl={{ antialias: true }}
		>
			<VolumetricShader />
			{process.env.NODE_ENV === 'development' && <Stats />}
			<Html fullscreen={true} zIndexRange={[50, 0]}>
				<div className="flex items-center justify-center h-screen">
				<Card className="z-0 w-11/12 p-4 mx-auto text-center border sm:w-9/12 md:w-1/2 lg:w-1/3 xl:w-4/12 2xl:w-1/4" isBlurred>
					<CardHeader className="flex justify-center gap-3">
						<div className="flex flex-col text-center">
						<p className="text-md">pawlick.dev</p>
						<p className="text-small text-default-500">Reaching for the Stars 🌌</p>
						</div>
					</CardHeader>
					<Divider/>
					<CardBody>
						<Button color="primary" radius="sm" variant="shadow" startContent={<FaCode />} as={Link as any} href='https://blog.pawlick.dev' className="m-1.5 xl:h-12 xl:text-lg transition-transform duration-200 transform-gpu hover:scale-110">
							Blog
						</Button>
						<Button color="primary" radius="sm" variant="shadow" startContent={<IoDocumentText/>} as={Link as any} href='https://docs.pawlick.dev' className="m-1.5 xl:h-12 xl:text-lg transition-transform duration-200 transform-gpu hover:scale-110">
							Documentation
						</Button>
						<Button color="primary" radius="sm" variant="shadow" startContent={<FaGithub/>} as={Link as any} href='https://github.com/lpawlick' className="m-1.5 xl:h-12 xl:text-lg transition-transform duration-200 transform-gpu hover:scale-110">
							Github
						</Button>
						<Button onPress={onOpen} as={Link as any} color="primary" radius="sm" variant="shadow" startContent={<HiMail/>} className="m-1.5 xl:h-12 xl:text-lg transition-transform duration-200 transform-gpu hover:scale-110">
							Contact
						</Button>
						<Modal 
							isOpen={isOpen} 
							placement="auto"
							onOpenChange={onOpenChange}
							backdrop="blur"
						>
							<ModalContent className="z-50">
							{(onClose) => (
								<>
								<ModalHeader className="flex flex-col gap-1">Email</ModalHeader>
								<ModalBody>
									{email}
								</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="light" onPress={onClose}>
									Close
									</Button>
								</ModalFooter>
								</>
							)}
							</ModalContent>
						</Modal>
					</CardBody>
				</Card>
			</div>

			</Html>
		</Canvas>
		</div>
	</>
	);
}
